import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function EquipmentPage() {
  const equipments = await prisma.equipment.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4 pt-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Equipment</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-700">
            沖煮器具
          </h1>
          <p className="text-base font-light leading-7 text-slate-500">
            管理濾杯、磨豆機與手沖壺等器具資料，建立更完整的沖煮上下文。
          </p>
        </div>

        <Link
          href="/equipment/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgb(99,102,241,0.2)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>新增器具</span>
        </Link>
      </header>

      {equipments.length === 0 ? (
        <section className="rounded-3xl border border-white/80 bg-white/60 p-8 text-center shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl">
          <h2 className="text-xl font-bold tracking-tight text-slate-700">
            尚未建立任何器具
          </h2>
          <p className="mt-3 text-sm font-light leading-7 text-slate-500">
            先新增第一個沖煮器具，讓後續資料維度更完整。
          </p>
        </section>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2">
          {equipments.map((equipment) => (
            <article
              key={equipment.id}
              className="rounded-[24px] border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(51,68,85,0.1)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-700">
                    {equipment.name}
                  </h2>
                  <p className="mt-2 text-sm font-mono tabular-nums text-slate-500">
                    {equipment.createdAt.toLocaleString("zh-TW")}
                  </p>
                </div>
                <span className="rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-medium text-slate-600 shadow-[0_8px_20px_rgb(51,68,85,0.04)]">
                  {equipment.type}
                </span>
              </div>

              <div className="mt-6 rounded-[24px] border border-white/80 bg-white/50 px-5 py-5">
                <p className="text-sm text-slate-500">品牌</p>
                <p className="mt-2 font-semibold text-slate-700">
                  {equipment.brand ?? "未填寫"}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
