import { streamObject } from "ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deepseek } from "@/lib/ai/provider";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts/system-prompt";
import { itinerarySchema } from "@/lib/ai/schema";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages } = await req.json();

    const latestMessage =
      messages[messages.length - 1]?.parts?.[0]?.text ??
      messages[messages.length - 1]?.content ??
      "";

    const result = streamObject({
      model: deepseek.chat("deepseek-chat"),
      system: SYSTEM_PROMPT,
      prompt: latestMessage,
      schema: itinerarySchema,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate itinerary" },
      { status: 500 },
    );
  }
}
