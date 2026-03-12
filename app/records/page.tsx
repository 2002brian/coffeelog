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
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-3 pt-4">
        <p className="text-sm font-medium text-slate-500">Records</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-700">
          沖煮紀錄
        </h1>
        <p className="text-base font-light leading-7 text-slate-500">
          集中查看每一次沖煮的參數與感官表現，方便回顧與比較。
        </p>
      </header>

      {records.length === 0 ? (
        <section className="rounded-3xl border border-white/80 bg-white/60 p-8 text-center shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl">
          <h2 className="text-xl font-bold tracking-tight text-slate-700">
            尚未建立任何沖煮紀錄
          </h2>
          <p className="mt-3 text-sm font-light leading-7 text-slate-500">
            先從一支咖啡豆開始，建立第一筆沖煮資料。
          </p>
        </section>
      ) : (
        <section className="grid gap-6">
          {records.map((record) => (
            <Link
              key={record.id}
              href={`/records/${record.id}`}
              className="rounded-[24px] border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_16px_40px_rgb(51,68,85,0.1)] active:scale-[0.99]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-700">
                    {record.bean.name}
                  </h2>
                  <p className="mt-2 text-sm font-mono tabular-nums text-slate-500">
                    {record.createdAt.toLocaleString("zh-TW")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-medium text-slate-600 shadow-[0_8px_20px_rgb(51,68,85,0.04)]">
                    粉水比 {formatRatio(record.dose, record.water)}
                  </div>
                  <ChevronRight className="h-5 w-5 text-violet-500" />
                </div>
              </div>

              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/80 bg-white/50 px-4 py-4">
                  <p className="text-slate-500">粉量 / 水量</p>
                  <p className="mt-2 font-mono font-semibold tabular-nums text-slate-700">
                    {record.dose}g / {record.water}ml
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/50 px-4 py-4">
                  <p className="text-slate-500">水溫</p>
                  <p className="mt-2 font-mono font-semibold tabular-nums text-slate-700">
                    {record.temperature}°C
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/50 px-4 py-4">
                  <p className="text-slate-500">酸 / 甜 / 體酯感</p>
                  <p className="mt-2 font-mono font-semibold tabular-nums text-slate-700">
                    {record.acidity} / {record.sweetness} / {record.body}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/50 px-4 py-4">
                  <p className="text-slate-500">器具</p>
                  <p className="mt-2 font-semibold text-slate-700">
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
