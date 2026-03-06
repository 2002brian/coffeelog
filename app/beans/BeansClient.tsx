"use client";

import { useFormStatus } from "react-dom";
import { addCoffeeBean } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "新增咖啡豆"}
    </button>
  );
}

export default function BeansClient() {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">新增咖啡豆</h2>
      <p className="mt-1 text-sm text-zinc-600">
        填入豆子基本資訊，建立可追蹤的沖煮資料來源。
      </p>

      <form action={addCoffeeBean} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm font-medium text-zinc-700">名稱</span>
          <input
            name="name"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
            placeholder="Ethiopia Yirgacheffe"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-zinc-700">產區</span>
          <input
            name="origin"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
            placeholder="Ethiopia"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-zinc-700">烘焙度</span>
          <input
            name="roastLevel"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
            placeholder="Light / Medium / Dark"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-zinc-700">處理法</span>
          <input
            name="process"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
            placeholder="Washed / Natural / Honey"
          />
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">風味描述</span>
          <textarea
            name="notes"
            rows={3}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
            placeholder="Floral, citrus, tea-like body..."
          />
        </label>

        <div className="sm:col-span-2">
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}
