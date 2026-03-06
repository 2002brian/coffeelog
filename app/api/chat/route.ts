import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  brewRecordId: number;
  messages: ChatMessage[];
};

export async function POST(req: Request) {
  try {
    const knowledgeFiles = [
      "domain_knowledge.md",
      "wbrc_metrics.md",
      "processing_corpus.md",
    ];
    const knowledgeContents: string[] = [];

    for (const fileName of knowledgeFiles) {
      const filePath = path.join(process.cwd(), "knowledge", fileName);
      try {
        const content = fs.readFileSync(filePath, "utf-8").trim();
        if (content.length > 0) {
          knowledgeContents.push(content);
        }
      } catch (error) {
        console.warn(
          `[Chat API] Unable to read knowledge file: ${filePath}`,
          error
        );
      }
    }

    const expertKnowledgeBase = knowledgeContents.join("\n\n");
    const body = (await req.json()) as ChatRequestBody;
    const brewRecordId = Number(body?.brewRecordId);
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (!Number.isInteger(brewRecordId) || brewRecordId <= 0) {
      return Response.json(
        { error: "Invalid brewRecordId. It must be a positive integer." },
        { status: 400 }
      );
    }

    const cleanedMessages = messages
      .filter(
        (m): m is ChatMessage =>
          !!m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .map((m) => ({
        role: m.role,
        content: m.content.trim(),
      }));

    if (cleanedMessages.length === 0) {
      return Response.json(
        { error: "messages is required and cannot be empty." },
        { status: 400 }
      );
    }

    const currentRecord = await prisma.brewRecord.findUnique({
      where: { id: brewRecordId },
      include: {
        bean: true,
      },
    });

    if (!currentRecord) {
      return Response.json({ error: "Brew record not found." }, { status: 404 });
    }

    if (!process.env.UNIEAI_API_KEY) {
      return Response.json(
        { error: "Missing UNIEAI_API_KEY." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.UNIEAI_API_KEY,
      baseURL: process.env.UNIEAI_BASE_URL || "https://api.unie.ai/v1",
    });

    const systemPrompt = `你是一位 WBrC 世界咖啡沖煮冠軍教練。使用者目前沖煮了一杯 ${currentRecord.bean.origin} 的 ${currentRecord.bean.process} 咖啡，參數為：粉量 ${currentRecord.dose}g、總水量 ${currentRecord.water}ml、水溫 ${currentRecord.temperature}°C。使用者的感官回饋為：酸度${currentRecord.acidity}分、甜度${currentRecord.sweetness}分、醇厚度${currentRecord.body}分。

請嚴格根據以下提供的 WBrC 官方準則與 SCA 理論，給出最精確的參數微調建議。

【最高指導原則】：
1. 語氣必須像一位親切、俐落的真人教練，絕對「不可以」使用 Markdown 表格。
2. 總字數嚴格控制在 150 字以內。
3. 只能針對「一個」最關鍵的參數給出具體建議，不要一次叫使用者改三個東西。

【請嚴格使用以下格式輸出】：
💡 下次建議：[一句話直接說出具體要調整的參數，例如：下次請將研磨度調粗一格]
🔍 冠軍解析：[用 2 到 3 句話，結合 SCA 理論或物理化學特性，白話解釋為什麼這樣調能解決使用者的痛點]

--- 知識庫開始 ---
${expertKnowledgeBase}
--- 知識庫結束 ---`;

    const stream = await openai.chat.completions.create({
      model: process.env.UNIEAI_MODEL || "gpt-oss-20b-20260226-7c31de1f",
      temperature: 0.4,
      stream: true,
      messages: [{ role: "system", content: systemPrompt }, ...cleanedMessages],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const payload = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process chat request." },
      { status: 500 }
    );
  }
}
