// Shared Azure AI/OpenAI client factory
// Uses DefaultAzureCredential when available, falls back to API key for local dev.

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { DefaultAzureCredential } from "@azure/identity";

let openAIClient;

export function getOpenAIClient() {
  if (openAIClient) return openAIClient;

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  if (!endpoint) throw new Error("Missing AZURE_OPENAI_ENDPOINT env var");

  // Prefer Managed Identity (no key) in production
  if (process.env.AZURE_OPENAI_KEY) {
    openAIClient = new OpenAIClient(endpoint, new AzureKeyCredential(process.env.AZURE_OPENAI_KEY));
  } else {
    const credential = new DefaultAzureCredential();
    openAIClient = new OpenAIClient(endpoint, credential);
  }
  return openAIClient;
}
