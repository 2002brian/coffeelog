import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatRatio(dose: number, water: number) {
  if (dose <= 0) {
    return "-";
  }

  return `1:${(water / dose).toFixed(1)}`;
}

export default async function RecordsPage() {
  const records = await prisma.brewRecord.findMany({
    include: {
      bean: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header className="space-y-2 pt-4">
        <p className="text-sm font-medium text-amber-600">Records</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          沖煮紀錄
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          集中查看每一次沖煮的參數與感官表現，方便回顧與比較。
        </p>
      </header>

      {records.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">
            尚未建立任何沖煮紀錄
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            先從一支咖啡豆開始，建立第一筆沖煮資料。
          </p>
        </section>
      ) : (
        <section className="grid gap-4">
          {records.map((record) => (
            <Link
              key={record.id}
              href={`/records/${record.id}`}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:bg-gray-50 hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {record.bean.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {record.createdAt.toLocaleString("zh-TW")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    粉水比 {formatRatio(record.dose, record.water)}
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-400" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-zinc-50 px-4 py-3">
                  <p className="text-zinc-500">粉量 / 水量</p>
                  <p className="mt-1 font-semibold text-zinc-900">
                    {record.dose}g / {record.water}ml
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-50 px-4 py-3">
                  <p className="text-zinc-500">水溫</p>
                  <p className="mt-1 font-semibold text-zinc-900">
                    {record.temperature}°C
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-50 px-4 py-3">
                  <p className="text-zinc-500">酸 / 甜 / 體酯感</p>
                  <p className="mt-1 font-semibold text-zinc-900">
                    {record.acidity} / {record.sweetness} / {record.body}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-50 px-4 py-3">
                  <p className="text-zinc-500">器具</p>
                  <p className="mt-1 font-semibold text-zinc-900">
                    {record.equipment}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
