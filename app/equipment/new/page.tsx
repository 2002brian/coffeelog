import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createEquipment } from "../actions";

const equipmentTypes = ["濾杯", "磨豆機", "手沖壺", "其他"] as const;

export default function NewEquipmentPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div className="pt-4">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>返回器具列表</span>
        </Link>
      </div>

      <section className="rounded-[24px] border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl">
        <header className="space-y-3">
          <p className="text-sm font-medium text-slate-500">New Equipment</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-700">
            新增沖煮器具
          </h1>
          <p className="text-base font-light leading-7 text-slate-500">
            建立一筆獨立器具資料，作為後續沖煮維度擴充的基礎。
          </p>
        </header>

        <form action={createEquipment} className="mt-6 grid gap-6">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">器具名稱</span>
            <input
              name="name"
              required
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="V60 02 濾杯"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">類型</span>
            <select
              name="type"
              required
              defaultValue="濾杯"
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
            >
              {equipmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">品牌</span>
            <input
              name="brand"
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none ring-cyan-400/40 transition focus:ring-2"
              placeholder="Hario"
            />
          </label>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgb(99,102,241,0.2)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              建立器具
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
