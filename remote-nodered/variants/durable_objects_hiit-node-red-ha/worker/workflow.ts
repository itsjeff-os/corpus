import { WorkflowEntrypoint } from "cloudflare:workers";
import type { WorkflowEvent, WorkflowStep } from "cloudflare:workers";
import type { AgentProposal, FleetAgent, FleetStatus } from "./durable-object";

const LEGACY_STEPS = ["process data", "wait 2 seconds", "wait for approval", "final"];
const MIN_REVIEW_ROUNDS = 1;
const MAX_REVIEW_ROUNDS = 3;
const REJECTION_FEEDBACK_FALLBACK =
	"Reviewer rejected proposal; suggest a safer alternative.";
const AI_AGENT_STEPS = [
	"think",
	"propose action",
	"human-approval",
	"execute action",
	"finish",
];
const ORCHESTRATOR_STEPS = [
	"spawn agents",
	"wait for all",
	"aggregate results",
	"final report",
];

interface ApprovalPayload {
	approved: boolean;
	feedback?: string;
}

interface AIAgentPayload {
	goal?: string;
	maxReviewRounds?: number;
}

interface OrchestratorPayload {
	objective?: string;
	subTasks?: string[];
}

interface AgentWorkflowPayload {
	orchestratorId: string;
	agentId: string;
	task: string;
	objective: string;
}

function getStatusStub(env: Env, instanceId: string) {
	const statusId = env.WORKFLOW_STATUS.idFromName(instanceId);
	return env.WORKFLOW_STATUS.get(statusId);
}

function asRecord(value: unknown): Record<string, unknown> | null {
	if (typeof value !== "object" || value === null) {
		return null;
	}
	return value as Record<string, unknown>;
}

function extractAIText(response: unknown): string {
	if (typeof response === "string") {
		return response;
	}

	const record = asRecord(response);
	if (!record) {
		return "";
	}

	if (typeof record.response === "string") {
		return record.response;
	}

	const result = record.result;
	if (typeof result === "string") {
		return result;
	}

	const outputText = record.output_text;
	if (typeof outputText === "string") {
		return outputText;
	}

	if (Array.isArray(record.output)) {
	const textParts = record.output
		.map((part) => {
			const partRecord = asRecord(part);
			return typeof partRecord?.text === "string" ? partRecord.text : "";
		})
		.filter(Boolean);
	if (textParts.length > 0) {
		return textParts.join("\n");
	}
	}

	return "";
}

async function generateAIText(env: Env, prompt: string, fallback: string): Promise<string> {
	try {
		const response = await env.AI.run(
			"@cf/meta/llama-3.1-8b-instruct" as keyof AiModels,
			{
				messages: [
					{
						role: "system",
						content:
							"You are an orchestration assistant that outputs concise operational suggestions.",
					},
					{ role: "user", content: prompt },
				],
			},
		);
		const aiText = extractAIText(response).trim();
		return aiText.length > 0 ? aiText : fallback;
	} catch {
		return fallback;
	}
}

/**
 * Original workflow kept for backward compatibility with starter template tests.
 */
export class MyWorkflow extends WorkflowEntrypoint<Env, Record<string, unknown>> {
	async run(event: WorkflowEvent<Record<string, unknown>>, step: WorkflowStep) {
		const instanceId = event.instanceId;
		const statusStub = getStatusStub(this.env, instanceId);
		await statusStub.reset(LEGACY_STEPS);

		const notifyStep = async (
			stepName: string,
			status: "running" | "completed" | "waiting",
		) => {
			await statusStub.updateStep(stepName, status);
		};

		await notifyStep("process data", "running");
		const result = await step.do("process data", async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return { processed: true, timestamp: Date.now() };
		});
		await notifyStep("process data", "completed");

		await notifyStep("wait 2 seconds", "running");
		await step.sleep("wait 2 seconds", "2 seconds");
		await notifyStep("wait 2 seconds", "completed");

		await notifyStep("wait for approval", "waiting");
		const approval = await step.waitForEvent("wait for approval", {
			type: "user-approval",
			timeout: "60 minutes",
		});
		await notifyStep("wait for approval", "completed");

		await notifyStep("final", "running");
		await step.do("final", async () => {
			console.log("Results:", { result, approval: approval.payload });
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});
		await notifyStep("final", "completed");
	}
}

/**
 * AI-driven orchestration with explicit human approval before execution.
 */
export class AIAgentWorkflow extends WorkflowEntrypoint<Env, AIAgentPayload> {
	async run(event: WorkflowEvent<AIAgentPayload>, step: WorkflowStep) {
		const instanceId = event.instanceId;
		const goal = event.payload.goal ?? "Prepare an automation plan for a production change.";
		const maxReviewRounds = Math.max(
			MIN_REVIEW_ROUNDS,
			Math.min(MAX_REVIEW_ROUNDS, event.payload.maxReviewRounds ?? 2),
		);
		const statusStub = getStatusStub(this.env, instanceId);
		await statusStub.reset(AI_AGENT_STEPS);

		try {
			let feedback = "";
			let approvedProposal: AgentProposal | null = null;

			for (let attempt = 1; attempt <= maxReviewRounds; attempt += 1) {
				await statusStub.updateStep("think", "running");
				const reasoning = await step.do(`think-${attempt}`, async () => {
					const prompt = [
						`Goal: ${goal}`,
						"Think through a safe and reversible execution strategy.",
						feedback ? `Reviewer feedback to incorporate: ${feedback}` : "",
					]
						.filter(Boolean)
						.join("\n");
					return generateAIText(
						this.env,
						prompt,
						"Break work into checkpoints, assess risk, and require approval before any irreversible action.",
					);
				});
				await statusStub.updateStep("think", "completed");

				await statusStub.updateStep("propose action", "running");
				const proposedAction = await step.do(`propose-action-${attempt}`, async () => {
					const prompt = [
						`Goal: ${goal}`,
						`Reasoning: ${reasoning}`,
						"Provide one concrete irreversible action that should require approval.",
					].join("\n");
					return generateAIText(
						this.env,
						prompt,
						"Promote the staged deployment to production traffic after validation checks pass.",
					);
				});

				const proposal: AgentProposal = {
					attempt,
					summary: `Attempt ${attempt} for objective: ${goal}`,
					reasoning,
					proposedAction,
				};
				await statusStub.updateProposal(proposal);
				await statusStub.updateStep("propose action", "completed");

				await statusStub.updateStep("human-approval", "waiting");
				const approvalEvent = await step.waitForEvent("human-approval", {
					type: "human-approval",
					timeout: "24 hours",
				});

				const payload = approvalEvent.payload as ApprovalPayload;
				await statusStub.updateStep("human-approval", "completed");
				if (payload.approved) {
					approvedProposal = proposal;
					break;
				}

				feedback = payload.feedback?.trim() || REJECTION_FEEDBACK_FALLBACK;
			}

			if (!approvedProposal) {
				await statusStub.setWorkflowStatus("error");
				await statusStub.updateProposal(null);
				throw new Error("Approval rejected in all review rounds.");
			}

			await statusStub.updateStep("execute action", "running");
			const executionSummary = await step.do("execute-action", async () => {
				const prompt = [
					`Approved action: ${approvedProposal?.proposedAction ?? ""}`,
					"Summarize execution result in one sentence.",
				].join("\n");
				return generateAIText(
					this.env,
					prompt,
					"Execution completed with checkpoint logs and rollback safety preserved.",
				);
			});
			await statusStub.updateStep("execute action", "completed");

			await statusStub.updateStep("finish", "running");
			await step.do("finish", async () => {
				console.log("AI orchestration result", {
					instanceId,
					summary: executionSummary,
				});
			});
			await statusStub.updateStep("finish", "completed");
			await statusStub.updateProposal(null);
		} catch (error) {
			await statusStub.setWorkflowStatus("error");
			throw error;
		}
	}
}

/**
 * Child workflow for parallel agent tasks.
 */
export class AgentWorkflow extends WorkflowEntrypoint<Env, AgentWorkflowPayload> {
	async run(event: WorkflowEvent<AgentWorkflowPayload>, step: WorkflowStep) {
		const payload = event.payload;
		const aggregatorId = this.env.AGGREGATOR_DO.idFromName(payload.orchestratorId);
		const aggregator = this.env.AGGREGATOR_DO.get(aggregatorId);

		try {
			const taskDetails = await step.do(`fetch-task-${payload.agentId}`, async () => {
				return `Agent ${payload.agentId} executing: ${payload.task}`;
			});

			const result = await step.do(`run-llm-loop-${payload.agentId}`, async () => {
				const prompt = [
					`Objective: ${payload.objective}`,
					`Sub-task: ${payload.task}`,
					"Produce a concise actionable result.",
				].join("\n");
				return generateAIText(
					this.env,
					prompt,
					`${taskDetails}. Produced implementation-ready output and validation notes.`,
				);
			});

			await step.do(`report-complete-${payload.agentId}`, async () => {
				await aggregator.reportAgentResult({
					orchestratorId: payload.orchestratorId,
					agentId: payload.agentId,
					task: payload.task,
					status: "completed",
					result,
				});
			});
		} catch (error) {
			await aggregator.reportAgentResult({
				orchestratorId: payload.orchestratorId,
				agentId: payload.agentId,
				task: payload.task,
				status: "error",
				error: error instanceof Error ? error.message : "Unknown child workflow error",
			});
			throw error;
		}
	}
}

/**
 * Parent workflow that fans out agent workflows and aggregates results.
 */
export class OrchestratorWorkflow extends WorkflowEntrypoint<Env, OrchestratorPayload> {
	async run(event: WorkflowEvent<OrchestratorPayload>, step: WorkflowStep) {
		const instanceId = event.instanceId;
		const objective = event.payload.objective ?? "Ship a production-ready feature safely.";
		const subTasks =
			event.payload.subTasks && event.payload.subTasks.length > 0
				? event.payload.subTasks
				: [
					"Design implementation approach",
					"Build code changes",
					"Validate with tests and checks",
					"Prepare release and rollback notes",
				];
		const statusStub = getStatusStub(this.env, instanceId);
		await statusStub.reset(ORCHESTRATOR_STEPS);

		const aggregatorId = this.env.AGGREGATOR_DO.idFromName(instanceId);
		const aggregator = this.env.AGGREGATOR_DO.get(aggregatorId);

		const agents: FleetAgent[] = subTasks.map((task, index) => ({
			agentId: `agent-${index + 1}`,
			task,
			status: "pending",
		}));
		await aggregator.initialize(instanceId, agents);

		try {
			await statusStub.updateStep("spawn agents", "running");
			await step.do("spawn-agents", async () => {
				await Promise.all(
					agents.map(async (agent) => {
						await this.env.AGENT_WORKFLOW.create({
							params: {
								orchestratorId: instanceId,
								agentId: agent.agentId,
								task: agent.task,
								objective,
							},
						});
					}),
				);
			});
			await statusStub.updateStep("spawn agents", "completed");

			await statusStub.updateStep("wait for all", "waiting");
			await step.waitForEvent("wait for all", {
				type: "all-complete",
				timeout: "2 hours",
			});
			await statusStub.updateStep("wait for all", "completed");

			await statusStub.updateStep("aggregate results", "running");
			const fleetStatus = await step.do<FleetStatus>(
				"aggregate-results",
				async () => {
					const status = await aggregator.getStatus();
					return structuredClone(status);
				},
			);
			await statusStub.updateStep("aggregate results", "completed");

			await statusStub.updateStep("final report", "running");
			const finalReport = await step.do("final-report", async () => {
				const joinedResults = fleetStatus.agents
					.map(
						(agent) =>
							`${agent.agentId} (${agent.task}): ${agent.result ?? agent.error ?? "no output"}`,
					)
					.join("\n");
				const prompt = [
					`Objective: ${objective}`,
					"Summarize these child agent outputs into an actionable final report:",
					joinedResults,
				].join("\n\n");
				return generateAIText(
					this.env,
					prompt,
					`All ${fleetStatus.totalAgents} agents completed. Consolidated outputs are ready for reviewer action.`,
				);
			});
			await aggregator.setFinalReport(finalReport);
			await statusStub.updateStep("final report", "completed");
		} catch (error) {
			await statusStub.setWorkflowStatus("error");
			throw error;
		}
	}
}
