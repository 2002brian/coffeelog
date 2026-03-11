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
      className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
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
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="text-zinc-500">1 - 5</span>
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
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">客觀參數</h2>
        <p className="mt-1 text-sm text-zinc-600">
          記錄可量化的沖煮條件，建立可比較的歷史基準。
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">咖啡豆</span>
            <select
              name="beanId"
              required
              defaultValue={defaultBeanId}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
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
            <span className="text-sm font-medium text-zinc-700">粉量 (g)</span>
            <input
              type="number"
              name="dose"
              step="0.1"
              min="0"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="15"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-zinc-700">總水量 (ml)</span>
            <input
              type="number"
              name="water"
              step="0.1"
              min="0"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="240"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-zinc-700">水溫 (°C)</span>
            <input
              type="number"
              name="temperature"
              step="0.1"
              min="0"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="92"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-zinc-700">總時間 (秒)</span>
            <input
              type="number"
              name="brewTime"
              step="1"
              min="0"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="165"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-zinc-700">器具</span>
            <input
              name="equipment"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="V60 02"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-zinc-700">
              研磨度 (選填)
            </span>
            <input
              name="grindSize"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="Comandante 24 clicks"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-zinc-700">
              悶蒸時間 (秒, 選填)
            </span>
            <input
              type="number"
              name="bloomTime"
              step="1"
              min="0"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="30"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">主觀感官</h2>
        <p className="mt-1 text-sm text-zinc-600">
          以 1-5 分紀錄感受，補上本次風味評價。
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SensoryRange name="acidity" label="酸度" />
          <SensoryRange name="sweetness" label="甜度" />
          <SensoryRange name="body" label="醇厚度" />
          <SensoryRange name="bitterness" label="苦味" />

          <label className="grid gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">
              文字評價 (Feedback)
            </span>
            <textarea
              name="feedback"
              rows={4}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="例如：甜感不足、尾韻偏乾，建議下次微調研磨或水溫。"
            />
          </label>
        </div>
      </section>

      <SubmitButton />
    </form>
  );
}
