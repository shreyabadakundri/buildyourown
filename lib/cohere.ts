import { CohereClientV2 } from "cohere-ai";
import { getCohereApiKey } from "@/lib/env";

const COHERE_MODEL = "command-a-03-2025";

export function getCohereClient(): CohereClientV2 {
  const token = getCohereApiKey();
  if (!token) {
    throw new Error("COHERE_API_KEY is not configured");
  }
  return new CohereClientV2({ token });
}

export function extractAssistantText(message: {
  content?: { type?: string; text?: string }[];
}): string {
  if (!message.content?.length) return "";
  return message.content
    .map((block) => {
      if (typeof block === "object" && block !== null && "type" in block) {
        if (block.type === "text" && "text" in block) {
          return String(block.text);
        }
      }
      return "";
    })
    .join("")
    .trim();
}

export async function cohereJsonChat(
  userPrompt: string,
  jsonSchema: Record<string, unknown>
): Promise<{ raw: string; prompt: string }> {
  const client = getCohereClient();
  const prompt = `${userPrompt}\n\nGenerate a JSON object matching the required schema. Return only valid JSON.`;

  const response = await client.chat({
    model: COHERE_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    responseFormat: {
      type: "json_object",
      jsonSchema,
    },
  });

  const raw = extractAssistantText(response.message);
  if (!raw) {
    throw new Error("Cohere returned an empty response");
  }
  return { raw, prompt };
}

export { COHERE_MODEL };