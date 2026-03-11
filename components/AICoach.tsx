"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function parseSSEChunk(chunk: string): string[] {
  const lines = chunk.split("\n");
  const output: string[] = [];

  for (const line of lines) {
    if (!line.startsWith("data:")) {
      continue;
    }

    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") {
      continue;
    }

    try {
      const json = JSON.parse(payload);
      const delta = json?.choices?.[0]?.delta?.content;

      if (typeof delta === "string" && delta.length > 0) {
        output.push(delta);
      }
    } catch {
      output.push(payload);
    }
  }

  return output;
}

export default function AICoach({ brewRecordId }: { brewRecordId: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = !isLoading && input.trim().length > 0;

  function appendAssistantText(text: string) {
    if (!text) {
      return;
    }

    setMessages((prev) => {
      if (prev.length === 0 || prev[prev.length - 1].role !== "assistant") {
        return [...prev, { role: "assistant", content: text }];
      }

      const next = [...prev];
      next[next.length - 1] = {
        ...next[next.length - 1],
        content: next[next.length - 1].content + text,
      };

      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const userText = input.trim();
    if (!userText || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userText },
    ];

    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brewRecordId,
          messages: nextMessages,
        }),
      });

      if (!response.ok || !response.body) {
        const detail = await response.text();
        throw new Error(detail || "Chat request failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const isSSE = (response.headers.get("content-type") || "").includes(
        "text/event-stream"
      );
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (!isSSE) {
          appendAssistantText(chunk);
          continue;
        }

        buffer += chunk;
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const pieces = parseSSEChunk(part);
          for (const text of pieces) {
            appendAssistantText(text);
          }
        }
      }

      if (isSSE && buffer.trim()) {
        const pieces = parseSSEChunk(buffer);
        for (const text of pieces) {
          appendAssistantText(text);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error.";
      setError(message);
      setMessages((prev) => {
        if (
          prev.length > 0 &&
          prev[prev.length - 1].role === "assistant" &&
          !prev[prev.length - 1].content
        ) {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: "抱歉，AI 回應失敗，請稍後再試。",
          };
          return next;
        }

        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <header className="mb-4 space-y-1">
        <h2 className="text-xl font-semibold text-zinc-900">AI 教練對話</h2>
        <p className="text-sm text-zinc-600">
          直接針對這杯的沖煮表現提問，取得即時調整建議。
        </p>
      </header>

      <div className="h-[360px] overflow-y-auto rounded-3xl bg-zinc-50 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm leading-6 text-zinc-500">
            先問 AI 一個具體問題，例如「這杯偏酸而且薄，下次先改哪個參數？」
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-zinc-800"
                  }`}
                >
                  {message.content ||
                    (isLoading && message.role === "assistant" ? "..." : "")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <form
        onSubmit={onSubmit}
        className="mt-4 flex items-end gap-3 rounded-[28px] border border-zinc-200 bg-white p-2 shadow-sm"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="輸入你想問 AI 教練的問題..."
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-11 items-center justify-center rounded-full bg-blue-500 px-5 text-sm font-medium text-white transition hover:bg-blue-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {isLoading ? "回應中" : "送出"}
        </button>
      </form>
    </section>
  );
}
