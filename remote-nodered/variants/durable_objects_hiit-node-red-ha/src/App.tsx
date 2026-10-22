import { useState, useEffect, useMemo } from "react";
import { WorkflowDiagram } from "./components/WorkflowDiagram";
import { CodeDisplay } from "./components/CodeDisplay";
import { BackgroundDots } from "./components/BackgroundDots";
import { ApprovalPanel } from "./components/ApprovalPanel";
import { FleetView } from "./components/FleetView";
import { useWorkflowWebSocket } from "./hooks/useWorkflowWebSocket";
import { AI_AGENT_STEPS, ORCHESTRATOR_STEPS } from "./types";
import type { DemoMode, StepDefinition } from "./types";

const WORKFLOW_COMPLETION_DISPLAY_DURATION_MS = 2500;

function App() {
	const [mode, setMode] = useState<DemoMode>("hitl");
	const [instanceId, setInstanceId] = useState<string | null>(null);
	const [isStarting, setIsStarting] = useState(false);

	const steps: StepDefinition[] = useMemo(
		() => (mode === "hitl" ? AI_AGENT_STEPS : ORCHESTRATOR_STEPS),
		[mode],
	);
	const workflowState = useWorkflowWebSocket(instanceId, steps);

	useEffect(() => {
		if (workflowState.workflowStatus === "completed") {
			const timer = setTimeout(() => {
				setInstanceId(null);
			}, WORKFLOW_COMPLETION_DISPLAY_DURATION_MS);
			return () => clearTimeout(timer);
		}
	}, [workflowState.workflowStatus]);

	useEffect(() => {
		if (
			workflowState.workflowStatus === "running" &&
			workflowState.currentStep
		) {
			setIsStarting(false);
		}
	}, [workflowState.workflowStatus, workflowState.currentStep]);

	useEffect(() => {
		setInstanceId(null);
		setIsStarting(false);
	}, [mode]);

	const handleStartWorkflow = async () => {
		setIsStarting(true);

		try {
			const endpoint = mode === "hitl" ? "/api/workflow/start" : "/api/orchestrator/start";
			const body =
				mode === "hitl"
					? {
						goal: "Design and execute a low-risk production rollout with human approval.",
						maxReviewRounds: 2,
					}
					: {
						objective: "Ship a scoped feature with parallel specialist agents.",
						subTasks: [
							"Scope architecture tradeoffs",
							"Implement production-ready code path",
							"Run quality and security validation",
							"Draft release checklist",
						],
					};

			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error("Failed to start workflow");
			}

			const data = (await response.json()) as { instanceId: string };
			setInstanceId(data.instanceId);
		} catch {
			alert("Failed to start workflow. Please try again.");
			setIsStarting(false);
		}
	};

	const handleApproval = async (approved: boolean, feedback: string) => {
		if (!instanceId) {
			return;
		}

		await fetch(`/api/workflow/event/${instanceId}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				eventType: "human-approval",
				approved,
				feedback: feedback.trim() || undefined,
			}),
		});
	};

	const waitingForApproval =
		mode === "hitl" && workflowState.currentStep === "human-approval";

	return (
		<div className="min-h-screen bg-neutral-50/30 dark:bg-neutral-950 flex flex-col relative">
			<div className="absolute inset-0 text-neutral-200/50 dark:text-neutral-700/40 overflow-hidden">
				<BackgroundDots />
			</div>

			<header className="px-6 pt-6 pb-4 relative z-10">
				<div className="flex items-center justify-between gap-4 flex-wrap">
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
							AI Workflow Orchestration Lab
						</h1>
						<div className="w-px h-4 bg-neutral-300/50 dark:bg-neutral-600/50" />
						<p className="text-xs text-neutral-500 dark:text-neutral-400">
							{mode === "hitl"
								? "Human-in-the-loop approval"
								: "Parallel multi-agent orchestration"}
						</p>
					</div>

					<div className="inline-flex rounded-lg bg-neutral-200/60 dark:bg-neutral-800/70 p-1">
						<button
							onClick={() => setMode("hitl")}
							className={`px-3 py-1 text-xs rounded-md transition-colors ${
								mode === "hitl"
									? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
									: "text-neutral-600 dark:text-neutral-300"
							}`}
						>
							HITL Agent
						</button>
						<button
							onClick={() => setMode("fleet")}
							className={`px-3 py-1 text-xs rounded-md transition-colors ${
								mode === "fleet"
									? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
									: "text-neutral-600 dark:text-neutral-300"
							}`}
						>
							Agent Fleet
						</button>
					</div>
				</div>
			</header>

			<main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
				<div className="w-full lg:w-[60%] overflow-auto px-6 pb-6 space-y-4">
					<CodeDisplay
						mode={mode}
						steps={steps}
						currentStep={workflowState.currentStep}
						workflowStatus={workflowState.workflowStatus}
						onStartWorkflow={handleStartWorkflow}
						isStarting={isStarting}
					/>

					{waitingForApproval ? (
						<ApprovalPanel
							proposal={workflowState.proposal}
							instanceId={instanceId}
							onSubmit={handleApproval}
						/>
					) : null}

					{mode === "fleet" ? (
						<FleetView fleetStatus={workflowState.fleetStatus} />
					) : null}
				</div>

				<div className="flex-1 overflow-hidden px-6 lg:pl-8 lg:pr-6 pb-6">
					<WorkflowDiagram
						steps={steps}
						stepStatuses={workflowState.stepStatuses}
						currentStep={workflowState.currentStep}
						workflowStatus={workflowState.workflowStatus}
						onStartWorkflow={handleStartWorkflow}
						isStarting={isStarting}
					/>
				</div>
			</main>
		</div>
	);
}

export default App;
