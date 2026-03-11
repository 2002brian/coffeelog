import { notFound } from "next/navigation";
import AICoach from "@/components/AICoach";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-50 px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-zinc-900">{value}</p>
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
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <header className="space-y-2">
          <p className="text-sm font-medium text-amber-600">Record Detail</p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {record.bean.name}
          </h1>
          <p className="text-sm text-zinc-600">
            {record.createdAt.toLocaleString("zh-TW")} · {record.bean.origin} ·{" "}
            {record.bean.process}
          </p>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <InfoCard label="酸度" value={`${record.acidity} / 5`} />
          <InfoCard label="甜度" value={`${record.sweetness} / 5`} />
          <InfoCard label="體酯感" value={`${record.body} / 5`} />
        </div>

        <div className="mt-5 rounded-2xl bg-zinc-50 px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            使用者評語
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-800">
            {record.feedback ?? "尚未留下文字評價。"}
          </p>
        </div>
      </section>

      <AICoach brewRecordId={record.id} />
    </main>
  );
}
