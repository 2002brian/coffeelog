"use client";

import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createBrewRecord } from "../actions";

type BeanOption = {
  id: number;
  name: string;
  roastLevel: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgb(99,102,241,0.2)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "建立沖煮紀錄"}
    </button>
  );
}

function SensoryRange({
  name,
  label,
  defaultValue = 3,
}: {
  name: "acidity" | "sweetness" | "body" | "bitterness";
  label: string;
  defaultValue?: number;
}) {
  return (
    <label className="grid gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-mono tabular-nums text-slate-500">1 - 5</span>
      </div>
      <input
        type="range"
        name={name}
        min={1}
        max={5}
        step={1}
        defaultValue={defaultValue}
        className="w-full accent-amber-600"
      />
    </label>
  );
}

export default function BrewFormClient({ beans }: { beans: BeanOption[] }) {
  const searchParams = useSearchParams();
  const beanIdParam = searchParams.get("beanId");
  const parsedBeanId = Number(beanIdParam);
  const defaultBeanId =
    Number.isInteger(parsedBeanId) &&
    beans.some((bean) => bean.id === parsedBeanId)
      ? String(parsedBeanId)
      : "";

  return (
    <form action={createBrewRecord} className="space-y-6">
      <section className="rounded-[24px] border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl">
        <h2 className="text-xl font-bold tracking-tight text-slate-700">客觀參數</h2>
        <p className="mt-2 text-base font-light leading-7 text-slate-500">
          記錄可量化的沖煮條件，建立可比較的歷史基準。
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-slate-600">咖啡豆</span>
            <select
              name="beanId"
              required
              defaultValue={defaultBeanId}
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
            >
              <option value="" disabled>
                請選擇咖啡豆
              </option>
              {beans.map((bean) => (
                <option key={bean.id} value={bean.id}>
                  {bean.name} ({bean.roastLevel})
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">粉量 (g)</span>
            <input
              type="number"
              name="dose"
              step="0.1"
              min="0"
              required
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-mono tabular-nums text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="15"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">總水量 (ml)</span>
            <input
              type="number"
              name="water"
              step="0.1"
              min="0"
              required
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-mono tabular-nums text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="240"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">水溫 (°C)</span>
            <input
              type="number"
              name="temperature"
              step="0.1"
              min="0"
              required
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-mono tabular-nums text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="92"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">總時間 (秒)</span>
            <input
              type="number"
              name="brewTime"
              step="1"
              min="0"
              required
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-mono tabular-nums text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="165"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">器具</span>
            <input
              name="equipment"
              required
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="V60 02"
            />
          </label>

          <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-600">
              研磨度 (選填)
            </span>
            <input
              name="grindSize"
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="Comandante 24 clicks"
            />
          </label>

          <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-600">
              悶蒸時間 (秒, 選填)
            </span>
            <input
              type="number"
              name="bloomTime"
              step="1"
              min="0"
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-mono tabular-nums text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="30"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[24px] border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl">
        <h2 className="text-xl font-bold tracking-tight text-slate-700">主觀感官</h2>
        <p className="mt-2 text-base font-light leading-7 text-slate-500">
          以 1-5 分紀錄感受，補上本次風味評價。
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <SensoryRange name="acidity" label="酸度" />
          <SensoryRange name="sweetness" label="甜度" />
          <SensoryRange name="body" label="醇厚度" />
          <SensoryRange name="bitterness" label="苦味" />

          <label className="grid gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-slate-600">
              文字評價 (Feedback)
            </span>
            <textarea
              name="feedback"
              rows={4}
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="例如：甜感不足、尾韻偏乾，建議下次微調研磨或水溫。"
            />
          </label>
        </div>
      </section>

      <SubmitButton />
    </form>
  );
}
