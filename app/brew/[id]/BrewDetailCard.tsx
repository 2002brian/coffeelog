type BrewDetail = {
  id: number;
  dose: number;
  water: number;
  temperature: number;
  equipment: string;
  brewTime: number;
  grindSize: string | null;
  bloomTime: number | null;
  acidity: number;
  sweetness: number;
  body: number;
  bitterness: number;
  feedback: string | null;
  createdAt: Date;
  bean: {
    id: number;
    name: string;
    origin: string;
    roastLevel: string;
    process: string;
    notes: string | null;
    createdAt: Date;
  };
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/50 p-5 shadow-[0_8px_20px_rgb(51,68,85,0.04)]">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-mono tabular-nums text-slate-700">{value}</p>
    </div>
  );
}

export default function BrewDetailCard({ record }: { record: BrewDetail }) {
  return (
    <section className="space-y-8 rounded-[24px] border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-700">
          沖煮紀錄 #{record.id}
        </h2>
        <p className="mt-2 text-sm font-mono tabular-nums text-slate-500">
          建立時間：{record.createdAt.toLocaleString("zh-TW")}
        </p>
      </header>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-slate-600">豆子資訊</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem label="名稱" value={record.bean.name} />
          <InfoItem label="產區" value={record.bean.origin} />
          <InfoItem label="烘焙度" value={record.bean.roastLevel} />
          <InfoItem label="處理法" value={record.bean.process} />
        </div>
        {record.bean.notes ? (
          <p className="mt-4 rounded-[24px] border border-white/80 bg-white/50 p-5 text-sm font-light leading-7 text-slate-500">
            {record.bean.notes}
          </p>
        ) : null}
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-slate-600">
          沖煮參數（客觀特徵）
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="粉量" value={`${record.dose} g`} />
          <InfoItem label="總水量" value={`${record.water} ml`} />
          <InfoItem label="水溫" value={`${record.temperature} °C`} />
          <InfoItem label="總時間" value={`${record.brewTime} 秒`} />
          <InfoItem label="器具" value={record.equipment} />
          <InfoItem label="研磨度" value={record.grindSize ?? "-"} />
          <InfoItem label="悶蒸時間" value={record.bloomTime ? `${record.bloomTime} 秒` : "-"} />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-slate-600">
          感官評分（主觀目標變數）
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="酸度" value={`${record.acidity} / 5`} />
          <InfoItem label="甜度" value={`${record.sweetness} / 5`} />
          <InfoItem label="醇厚度" value={`${record.body} / 5`} />
          <InfoItem label="苦味" value={`${record.bitterness} / 5`} />
        </div>
        <div className="mt-4 rounded-[24px] border border-white/80 bg-white/50 p-5 shadow-[0_8px_20px_rgb(51,68,85,0.04)]">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Feedback
          </p>
          <p className="mt-2 text-sm font-light leading-7 text-slate-500">
            {record.feedback ?? "-"}
          </p>
        </div>
      </div>
    </section>
  );
}
