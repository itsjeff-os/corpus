import type { Bindings, ControlPlaneState } from '../types';

interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export async function runOpenAIOrchestration(params: {
  message: string;
  memoryContext: string;
  controlPlane: ControlPlaneState;
  env: Bindings;
}): Promise<string> {
  const { message, memoryContext, controlPlane, env } = params;

  const messages: OpenAIChatMessage[] = [
    {
      role: 'system',
      content: [
        'You are the Agentic Vault reasoning layer.',
        'Use memory context only when relevant.',
        'Respect the control plane constraints and permissions.',
        `Control plane: ${JSON.stringify({
          constraints: controlPlane.constraints,
          permissions: controlPlane.permissions
        })}`,
        `Memory context: ${memoryContext || 'No memory context available for this turn.'}`
      ].join('\n')
    },
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI orchestration failed: ${response.status} ${detail}`);
  }

  const data = await response.json<OpenAIChatResponse>();
  return data.choices?.[0]?.message?.content ?? 'No response generated.';
}
