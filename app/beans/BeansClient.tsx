"use client";

import { useFormStatus } from "react-dom";
import { addCoffeeBean } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgb(99,102,241,0.2)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "新增咖啡豆"}
    </button>
  );
}

export default function BeansClient() {
  return (
    <section className="rounded-[24px] border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl">
      <h2 className="text-xl font-bold tracking-tight text-slate-700">新增咖啡豆</h2>
      <p className="mt-2 text-base font-light leading-7 text-slate-500">
        填入豆子基本資訊，建立可追蹤的沖煮資料來源。
      </p>

      <form action={addCoffeeBean} className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-600">名稱</span>
          <input
            name="name"
            required
            className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
            placeholder="Ethiopia Yirgacheffe"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-600">產區</span>
          <input
            name="origin"
            required
            className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
            placeholder="Ethiopia"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-600">烘焙度</span>
          <input
            name="roastLevel"
            required
            className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
            placeholder="Light / Medium / Dark"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-600">處理法</span>
          <input
            name="process"
            required
            className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
            placeholder="Washed / Natural / Honey"
          />
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-sm font-medium text-slate-600">風味描述</span>
          <textarea
            name="notes"
            rows={3}
            className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
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
