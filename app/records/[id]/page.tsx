import { notFound } from "next/navigation";
import AICoach from "@/components/AICoach";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/50 px-5 py-5 shadow-[0_8px_20px_rgb(51,68,85,0.04)]">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-mono font-semibold tabular-nums text-slate-700">
        {value}
      </p>
    </div>
  );
}

function formatRatio(dose: number, water: number) {
  if (dose <= 0) {
    return "-";
  }

  return `1:${(water / dose).toFixed(1)}`;
}

export default async function RecordDetailPage({ params }: PageProps) {
  const { id } = await params;
  const recordId = Number.parseInt(id, 10);

  if (!Number.isInteger(recordId) || recordId <= 0) {
    notFound();
  }

  const record = await prisma.brewRecord.findUnique({
    where: { id: recordId },
    include: { bean: true },
  });

  if (!record) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <section className="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl">
        <header className="space-y-3">
          <p className="text-sm font-medium text-slate-500">Record Detail</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-700">
            {record.bean.name}
          </h1>
          <p className="text-sm font-light text-slate-500">
            {record.createdAt.toLocaleString("zh-TW")} · {record.bean.origin} ·{" "}
            {record.bean.process}
          </p>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard label="粉量 / 水量" value={`${record.dose}g / ${record.water}ml`} />
          <InfoCard label="粉水比" value={formatRatio(record.dose, record.water)} />
          <InfoCard label="水溫" value={`${record.temperature}°C`} />
          <InfoCard label="總時間" value={`${record.brewTime} 秒`} />
          <InfoCard label="器具" value={record.equipment} />
          <InfoCard label="研磨度" value={record.grindSize ?? "-"} />
          <InfoCard
            label="悶蒸時間"
            value={record.bloomTime !== null ? `${record.bloomTime} 秒` : "-"}
          />
          <InfoCard label="烘焙度" value={record.bean.roastLevel} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoCard label="酸度" value={`${record.acidity} / 5`} />
          <InfoCard label="甜度" value={`${record.sweetness} / 5`} />
          <InfoCard label="體酯感" value={`${record.body} / 5`} />
        </div>

        <div className="mt-6 rounded-[24px] border border-white/80 bg-white/50 px-5 py-5 shadow-[0_8px_20px_rgb(51,68,85,0.04)]">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            使用者評語
          </p>
          <p className="mt-3 text-sm font-light leading-7 text-slate-500">
            {record.feedback ?? "尚未留下文字評價。"}
          </p>
        </div>
      </section>

      <AICoach brewRecordId={record.id} />
    </main>
  );
}
