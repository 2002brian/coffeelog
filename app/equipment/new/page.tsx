import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createEquipment } from "../actions";

const equipmentTypes = ["濾杯", "磨豆機", "手沖壺", "其他"] as const;

export default function NewEquipmentPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div className="pt-4">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>返回器具列表</span>
        </Link>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <header className="space-y-2">
          <p className="text-sm font-medium text-amber-600">New Equipment</p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            新增沖煮器具
          </h1>
          <p className="text-sm leading-6 text-zinc-600">
            建立一筆獨立器具資料，作為後續沖煮維度擴充的基礎。
          </p>
        </header>

        <form action={createEquipment} className="mt-6 grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-zinc-700">器具名稱</span>
            <input
              name="name"
              required
              className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="V60 02 濾杯"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-zinc-700">類型</span>
            <select
              name="type"
              required
              defaultValue="濾杯"
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
            >
              {equipmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-zinc-700">品牌</span>
            <input
              name="brand"
              className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-500 transition focus:ring-2"
              placeholder="Hario"
            />
          </label>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95"
            >
              建立器具
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
