export {
	MyWorkflow,
	AIAgentWorkflow,
	AgentWorkflow,
	OrchestratorWorkflow,
} from "./workflow";
export { WorkflowStatusDO, AggregatorDO } from "./durable-object";

interface StartAIBody {
	goal?: string;
	maxReviewRounds?: number;
}

interface StartOrchestratorBody {
	objective?: string;
	subTasks?: string[];
}

interface WorkflowEventBody {
	eventType?: string;
	approved?: boolean;
	feedback?: string;
	comment?: string;
	payload?: Record<string, unknown>;
}

function jsonError(message: string, status: number): Response {
	return Response.json({ error: message }, { status });
}

async function readJson<T>(request: Request): Promise<T | null> {
	try {
		return (await request.json()) as T;
	} catch {
		return null;
	}
}

function getWorkflowFromMode(env: Env, mode: string | null) {
	if (mode === "legacy") {
		return env.MY_WORKFLOW;
	}
	if (mode === "orchestrator") {
		return env.ORCHESTRATOR_WORKFLOW;
	}
	return env.AI_AGENT_WORKFLOW;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/api/workflow/start" && request.method === "POST") {
			const body = await readJson<StartAIBody>(request);
			try {
				const instance = await env.AI_AGENT_WORKFLOW.create({
					params: {
						goal: body?.goal,
						maxReviewRounds: body?.maxReviewRounds,
					},
				});
				return Response.json({
					instanceId: instance.id,
					message: "AI HITL workflow started",
				});
			} catch {
				return jsonError("Failed to start AI workflow", 500);
			}
		}

		if (
			url.pathname === "/api/orchestrator/start" &&
			request.method === "POST"
		) {
			const body = await readJson<StartOrchestratorBody>(request);
			try {
				const instance = await env.ORCHESTRATOR_WORKFLOW.create({
					params: {
						objective: body?.objective,
						subTasks: body?.subTasks,
					},
				});

				return Response.json({
					instanceId: instance.id,
					message: "Orchestrator workflow started",
				});
			} catch {
				return jsonError("Failed to start orchestrator workflow", 500);
			}
		}

		if (url.pathname.startsWith("/api/workflow/status/")) {
			const instanceId = url.pathname.split("/").pop();
			if (!instanceId) {
				return jsonError("Instance ID required", 400);
			}

			try {
				const mode = url.searchParams.get("mode");
				const workflow = getWorkflowFromMode(env, mode);
				const instance = await workflow.get(instanceId);
				const status = await instance.status();
				return Response.json(status);
			} catch {
				return jsonError("Failed to get workflow status", 500);
			}
		}

		if (url.pathname.startsWith("/api/orchestrator/status/")) {
			const instanceId = url.pathname.split("/").pop();
			if (!instanceId) {
				return jsonError("Instance ID required", 400);
			}

			try {
				const doId = env.AGGREGATOR_DO.idFromName(instanceId);
				const aggregator = env.AGGREGATOR_DO.get(doId);
				const status = await aggregator.getStatus();
				return Response.json(status);
			} catch {
				return jsonError("Failed to get orchestrator status", 500);
			}
		}

		if (
			url.pathname.startsWith("/api/workflow/event/") &&
			request.method === "POST"
		) {
			const instanceId = url.pathname.split("/").pop();
			if (!instanceId) {
				return jsonError("Instance ID required", 400);
			}

			const body = await readJson<WorkflowEventBody>(request);
			if (!body) {
				return jsonError("Invalid JSON body", 400);
			}

			const eventType = body.eventType ?? "human-approval";
			const eventPayload =
				typeof body.payload === "object" && body.payload
					? body.payload
					: {
						approved: body.approved,
							// Preserve compatibility with starter-template clients that still send "comment".
							feedback: body.feedback ?? body.comment,
						};

			try {
				const workflow =
					eventType === "user-approval" ? env.MY_WORKFLOW : env.AI_AGENT_WORKFLOW;
				const instance = await workflow.get(instanceId);
				await instance.sendEvent({
					type: eventType,
					payload: eventPayload,
				});

				return Response.json({
					success: true,
					message: "Event sent successfully",
				});
			} catch {
				return jsonError("Failed to send event", 500);
			}
		}

		if (url.pathname === "/ws") {
			const instanceId = url.searchParams.get("instanceId");
			if (!instanceId) {
				return new Response("instanceId query parameter required", {
					status: 400,
				});
			}

			const upgradeHeader = request.headers.get("Upgrade");
			if (upgradeHeader !== "websocket") {
				return new Response("Expected Upgrade: websocket", { status: 426 });
			}

			try {
				const doId = env.WORKFLOW_STATUS.idFromName(instanceId);
				const stub = env.WORKFLOW_STATUS.get(doId);
				return stub.fetch(request);
			} catch {
				return new Response("Failed to establish WebSocket connection", {
					status: 500,
				});
			}
		}

		return jsonError("Not Found", 404);
	},
} satisfies ExportedHandler<Env>;
