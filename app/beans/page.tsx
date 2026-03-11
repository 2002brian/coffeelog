import Link from "next/link";
import BeansClient from "./BeansClient";
import { prisma } from "@/lib/prisma";

export default async function BeansPage() {
  const beans = await prisma.coffeeBean.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Coffee Beans
        </h1>
        <p className="text-sm text-zinc-600">
          管理你的咖啡豆資料，作為沖煮紀錄與 AI 建議的基礎。
        </p>
      </header>

      <BeansClient />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">豆單列表</h2>

        {beans.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
            目前尚無咖啡豆資料，先新增第一支豆子吧。
          </div>
        ) : (
          <div className="grid gap-4">
            {beans.map((bean) => (
              <article
                key={bean.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">
                      {bean.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600">
                      {bean.origin} | {bean.roastLevel} | {bean.process}
                    </p>
                  </div>
                  <time className="text-xs text-zinc-500">
                    {bean.createdAt.toLocaleString("zh-TW")}
                  </time>
                </div>

                {bean.notes ? (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                    {bean.notes}
                  </p>
                ) : null}

                <div className="mt-4">
                  <Link
                    href={`/brew/new?beanId=${bean.id}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-amber-600 active:scale-[0.98] active:bg-amber-700"
                  >
                    ☕️ 沖煮這支豆子
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
