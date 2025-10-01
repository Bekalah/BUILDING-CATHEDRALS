// Azure Function: generateStory
// Generates ND-safe, trauma-aware narrative content via Azure OpenAI

import { getOpenAIClient } from "../_shared/azureClients.js";

// Basic exponential backoff retry wrapper
async function withRetry(fn, { retries = 3, baseDelay = 300 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

export default async function (context, req) {
  const start = Date.now();
  try {
    const { storyArc = "Unfolding Fractal", currentChapter = "Prologue", playerAttributes = {} } = req.body || {};

    const prompt = `Generate trauma-aware, ND-safe narrative content for a therapeutic storytelling system.\n\nStory Arc: ${storyArc}\nCurrent Chapter: ${currentChapter}\nPlayer State: ${JSON.stringify(playerAttributes)}\n\nRequirements:\n- Gentle supportive tone\n- No violence or triggering imagery\n- Emphasize healing, growth, transformation\n- Archetypal yet soothing\n- 200-300 words narrative segment.`;

    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";

    const client = getOpenAIClient();

    const result = await withRetry(() => client.getCompletions(deployment, [prompt], {
      maxTokens: 380,
      temperature: 0.7,
      topP: 0.9,
      presencePenalty: 0.3,
      frequencyPenalty: 0.3
    }));

    const choice = result.choices?.[0]?.text?.trim() || "A gentle narrative emerges but something was quiet in the lattice.";

    context.res = {
      headers: { 'Content-Type': 'application/json' },
      body: {
        content: choice,
        metadata: {
          model: deployment,
          tokens: result.usage?.totalTokens || null,
          generated: true,
          latencyMs: Date.now() - start
        }
      }
    };
  } catch (err) {
    context.log.error("generateStory error", err);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: {
        error: {
          code: 'STORY_GENERATION_FAILED',
          message: 'Story generation unavailable. Using local fallback.',
        }
      }
    };
  }
}
