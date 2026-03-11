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
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4 pt-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-amber-600">Equipment</p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            沖煮器具
          </h1>
          <p className="text-sm leading-6 text-zinc-600">
            管理濾杯、磨豆機與手沖壺等器具資料，建立更完整的沖煮上下文。
          </p>
        </div>

        <Link
          href="/equipment/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>新增器具</span>
        </Link>
      </header>

      {equipments.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">
            尚未建立任何器具
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            先新增第一個沖煮器具，讓後續資料維度更完整。
          </p>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          {equipments.map((equipment) => (
            <article
              key={equipment.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {equipment.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {equipment.createdAt.toLocaleString("zh-TW")}
                  </p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  {equipment.type}
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-3">
                <p className="text-sm text-zinc-500">品牌</p>
                <p className="mt-1 font-semibold text-zinc-900">
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
