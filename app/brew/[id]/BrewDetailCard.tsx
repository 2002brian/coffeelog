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
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-zinc-900">{value}</p>
    </div>
  );
}

export default function BrewDetailCard({ record }: { record: BrewDetail }) {
  return (
    <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-xl font-semibold text-zinc-900">沖煮紀錄 #{record.id}</h2>
        <p className="mt-1 text-sm text-zinc-600">
          建立時間：{record.createdAt.toLocaleString("zh-TW")}
        </p>
      </header>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900">豆子資訊</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoItem label="名稱" value={record.bean.name} />
          <InfoItem label="產區" value={record.bean.origin} />
          <InfoItem label="烘焙度" value={record.bean.roastLevel} />
          <InfoItem label="處理法" value={record.bean.process} />
        </div>
        {record.bean.notes ? (
          <p className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
            {record.bean.notes}
          </p>
        ) : null}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900">
          沖煮參數（客觀特徵）
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
        <h3 className="mb-3 text-sm font-semibold text-zinc-900">
          感官評分（主觀目標變數）
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="酸度" value={`${record.acidity} / 5`} />
          <InfoItem label="甜度" value={`${record.sweetness} / 5`} />
          <InfoItem label="醇厚度" value={`${record.body} / 5`} />
          <InfoItem label="苦味" value={`${record.bitterness} / 5`} />
        </div>
        <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Feedback
          </p>
          <p className="mt-1 text-sm text-zinc-900">{record.feedback ?? "-"}</p>
        </div>
      </div>
    </section>
  );
}
