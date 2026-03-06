"use client";

import { FormEvent, useMemo, useState } from "react";

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

export default function AIChatClient({ brewRecordId }: { brewRecordId: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => !isLoading && input.trim().length > 0,
    [input, isLoading]
  );

  function appendAssistantText(text: string) {
    if (!text) return;
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
    if (!userText || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: userText }];
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
        if (done) break;

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
        if (prev.length > 0 && prev[prev.length - 1].role === "assistant" && !prev[prev.length - 1].content) {
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
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900">AI 沖煮顧問</h2>
        <p className="mt-1 text-sm text-zinc-600">
          根據本次與歷史沖煮數據，取得下一次參數微調建議。
        </p>
      </header>

      <div className="h-[320px] overflow-y-auto rounded-md border border-zinc-200 bg-zinc-50 p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">
            先輸入你的問題，例如：「這杯偏酸且薄，下次怎麼調？」
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-amber-100 text-zinc-900"
                    : "bg-white text-zinc-800"
                }`}
              >
                {message.content || (isLoading && message.role === "assistant" ? "..." : "")}
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入你的沖煮問題..."
          className="min-w-0 flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "回應中..." : "送出"}
        </button>
      </form>
    </section>
  );
}
