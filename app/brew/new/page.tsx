import { Suspense } from "react";
import BrewFormClient from "./BrewFormClient";
import { prisma } from "@/lib/prisma";

type BeanOption = {
  id: number;
  name: string;
  roastLevel: string;
};

function BrewForm({ beans }: { beans: BeanOption[] }) {
  return <BrewFormClient beans={beans} />;
}

export default async function NewBrewPage() {
  const beans = await prisma.coffeeBean.findMany({
    select: {
      id: true,
      name: true,
      roastLevel: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (beans.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-700">
          目前沒有可用的咖啡豆資料，請先前往新增咖啡豆。
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          新增沖煮紀錄
        </h1>
        <p className="text-sm text-zinc-600">
          綁定咖啡豆並記錄本次沖煮條件，建立可回溯的萃取歷程。
        </p>
      </header>

      <Suspense fallback={<div>載入中...</div>}>
        <BrewForm beans={beans} />
      </Suspense>
    </main>
  );
}
