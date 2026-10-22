import { DurableObject } from "cloudflare:workers";

export type WorkflowLifecycleStatus = "running" | "completed" | "error";

export interface AgentProposal {
	attempt: number;
	summary: string;
	reasoning: string;
	proposedAction: string;
}

export interface FleetAgent {
	agentId: string;
	task: string;
	status: "pending" | "running" | "completed" | "error";
	result?: string;
	error?: string;
}

export interface FleetStatus {
	totalAgents: number;
	completedAgents: number;
	agents: FleetAgent[];
	finalReport?: string;
}

/**
 * WorkflowStatusDO manages real-time workflow UI state and websocket clients.
 */
export class WorkflowStatusDO extends DurableObject {
	private stepStatuses: Map<string, string>;
	private currentStep: string | null;
	private workflowStatus: WorkflowLifecycleStatus;
	private proposal: AgentProposal | null;
	private fleetStatus: FleetStatus | null;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		this.stepStatuses = new Map();
		this.currentStep = null;
		this.workflowStatus = "running";
		this.proposal = null;
		this.fleetStatus = null;

		ctx.blockConcurrencyWhile(async () => {
			const storedStatuses =
				await ctx.storage.get<Record<string, string>>("stepStatuses");
			const storedCurrent = await ctx.storage.get<string | null>("currentStep");
			const storedWorkflowStatus = await ctx.storage.get<WorkflowLifecycleStatus>(
				"workflowStatus",
			);
			const storedProposal = await ctx.storage.get<AgentProposal | null>(
				"proposal",
			);
			const storedFleet = await ctx.storage.get<FleetStatus | null>("fleetStatus");

			this.stepStatuses = new Map(Object.entries(storedStatuses ?? {}));
			this.currentStep = storedCurrent ?? null;
			this.workflowStatus = storedWorkflowStatus ?? "running";
			this.proposal = storedProposal ?? null;
			this.fleetStatus = storedFleet ?? null;
		});
	}

	async fetch(request: Request): Promise<Response> {
		if (request.headers.get("Upgrade") === "websocket") {
			const pair = new WebSocketPair();
			const [client, server] = Object.values(pair);

			this.ctx.acceptWebSocket(server);
			server.send(JSON.stringify(this.getStateMessage()));

			return new Response(null, { status: 101, webSocket: client });
		}

		return Response.json(this.getStateMessage());
	}

	async reset(steps: string[] = []): Promise<void> {
		this.stepStatuses = new Map(steps.map((stepName) => [stepName, "pending"]));
		this.currentStep = null;
		this.workflowStatus = "running";
		this.proposal = null;
		this.fleetStatus = null;
		await this.persist();
		this.broadcast(this.getStateMessage());
	}

	async updateStep(stepName: string, status: string): Promise<void> {
		if (!this.stepStatuses.has(stepName)) {
			this.stepStatuses.set(stepName, "pending");
		}

		this.stepStatuses.set(stepName, status);

		if (status === "running" || status === "waiting") {
			this.currentStep = stepName;
		}

		if (status === "error") {
			this.workflowStatus = "error";
		}

		const hasSteps = this.stepStatuses.size > 0;
		const allCompleted = hasSteps
			? Array.from(this.stepStatuses.values()).every((s) => s === "completed")
			: false;
		if (allCompleted) {
			this.workflowStatus = "completed";
			this.currentStep = null;
		}

		await this.persist();
		this.broadcast(this.getStateMessage());
	}

	async setWorkflowStatus(status: WorkflowLifecycleStatus): Promise<void> {
		this.workflowStatus = status;
		if (status === "completed") {
			this.currentStep = null;
		}
		await this.persist();
		this.broadcast(this.getStateMessage());
	}

	async updateProposal(proposal: AgentProposal | null): Promise<void> {
		this.proposal = proposal;
		await this.persist();
		this.broadcast(this.getStateMessage());
	}

	async updateFleetStatus(fleetStatus: FleetStatus | null): Promise<void> {
		this.fleetStatus = fleetStatus;
		await this.persist();
		this.broadcast(this.getStateMessage());
	}

	async webSocketMessage(ws: WebSocket, _message: string): Promise<void> {
		ws.send(JSON.stringify(this.getStateMessage()));
	}

	async webSocketClose(
		ws: WebSocket,
		code: number,
		reason: string,
		_wasClean: boolean,
	): Promise<void> {
		ws.close(code, reason);
	}

	private async persist(): Promise<void> {
		await Promise.all([
			this.ctx.storage.put("stepStatuses", Object.fromEntries(this.stepStatuses)),
			this.ctx.storage.put("currentStep", this.currentStep),
			this.ctx.storage.put("workflowStatus", this.workflowStatus),
			this.ctx.storage.put("proposal", this.proposal),
			this.ctx.storage.put("fleetStatus", this.fleetStatus),
		]);
	}

	private broadcast(message: object): void {
		const sockets = this.ctx.getWebSockets();
		const json = JSON.stringify(message);

		for (const socket of sockets) {
			try {
				socket.send(json);
			} catch {
				// Ignore disconnected socket errors.
			}
		}
	}

	private getStateMessage(): object {
		return {
			type: "workflow_update",
			currentStep: this.currentStep,
			stepStatuses: Object.fromEntries(this.stepStatuses),
			workflowStatus: this.workflowStatus,
			proposal: this.proposal,
			fleetStatus: this.fleetStatus,
			timestamp: Date.now(),
		};
	}
}

interface AgentResultPayload {
	orchestratorId: string;
	agentId: string;
	task: string;
	status: "completed" | "error";
	result?: string;
	error?: string;
}

/**
 * AggregatorDO tracks child agent progress and notifies the parent workflow.
 */
export class AggregatorDO extends DurableObject {
	private state: FleetStatus;
	private orchestratorId: string | null;
	private allCompleteNotified: boolean;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		this.orchestratorId = null;
		this.allCompleteNotified = false;
		this.state = {
			totalAgents: 0,
			completedAgents: 0,
			agents: [],
		};

		ctx.blockConcurrencyWhile(async () => {
			this.orchestratorId =
				(await ctx.storage.get<string>("orchestratorId")) ?? null;
			this.allCompleteNotified =
				(await ctx.storage.get<boolean>("allCompleteNotified")) ?? false;
			const storedState = await ctx.storage.get<FleetStatus>("state");
			if (storedState) {
				this.state = storedState;
			}
		});
	}

	async initialize(orchestratorId: string, agents: FleetAgent[]): Promise<void> {
		this.orchestratorId = orchestratorId;
		this.allCompleteNotified = false;
		this.state = {
			totalAgents: agents.length,
			completedAgents: 0,
			agents,
		};
		await this.persist();
		await this.syncWorkflowStatus();
	}

	async reportAgentResult(payload: AgentResultPayload): Promise<void> {
		this.orchestratorId = payload.orchestratorId;
		const nextAgents = this.state.agents.map((agent) => {
			if (agent.agentId !== payload.agentId) {
				return agent;
			}

			return {
				...agent,
				status: payload.status,
				result: payload.result,
				error: payload.error,
			};
		});

		const completedAgents = nextAgents.filter(
			(agent) => agent.status === "completed" || agent.status === "error",
		).length;

		this.state = {
			...this.state,
			agents: nextAgents,
			completedAgents,
		};

		await this.persist();
		await this.syncWorkflowStatus();
		await this.notifyIfDone();
	}

	async setFinalReport(finalReport: string): Promise<void> {
		this.state = {
			...this.state,
			finalReport,
		};
		await this.persist();
		await this.syncWorkflowStatus();
	}

	async getStatus(): Promise<FleetStatus> {
		return this.state;
	}

	private async notifyIfDone(): Promise<void> {
		if (!this.orchestratorId || this.allCompleteNotified) {
			return;
		}

		if (this.state.completedAgents < this.state.totalAgents) {
			return;
		}

		const instance = await this.env.ORCHESTRATOR_WORKFLOW.get(this.orchestratorId);
		await instance.sendEvent({
			type: "all-complete",
			payload: {
				completedAgents: this.state.completedAgents,
				totalAgents: this.state.totalAgents,
			},
		});

		this.allCompleteNotified = true;
		await this.ctx.storage.put("allCompleteNotified", true);
	}

	private async syncWorkflowStatus(): Promise<void> {
		if (!this.orchestratorId) {
			return;
		}

		const doId = this.env.WORKFLOW_STATUS.idFromName(this.orchestratorId);
		const statusStub = this.env.WORKFLOW_STATUS.get(doId);
		await statusStub.updateFleetStatus(this.state);
	}

	private async persist(): Promise<void> {
		await Promise.all([
			this.ctx.storage.put("orchestratorId", this.orchestratorId),
			this.ctx.storage.put("allCompleteNotified", this.allCompleteNotified),
			this.ctx.storage.put("state", this.state),
		]);
	}
}
