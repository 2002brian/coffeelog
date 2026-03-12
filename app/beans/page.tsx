import { Coffee } from "lucide-react";
import Link from "next/link";
import BeansClient from "./BeansClient";
import { prisma } from "@/lib/prisma";

export default async function BeansPage() {
  const beans = await prisma.coffeeBean.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-700">
          Coffee Beans
        </h1>
        <p className="text-base font-light leading-7 text-slate-500">
          管理你的咖啡豆資料，作為沖煮紀錄與 AI 建議的基礎。
        </p>
      </header>

      <BeansClient />

      <section className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-700">豆單列表</h2>

        {beans.length === 0 ? (
          <div className="rounded-3xl border border-white/80 bg-white/60 p-8 text-sm font-light text-slate-500 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl">
            目前尚無咖啡豆資料，先新增第一支豆子吧。
          </div>
        ) : (
          <div className="grid gap-6">
            {beans.map((bean) => (
              <article
                key={bean.id}
                className="rounded-[24px] border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(51,68,85,0.1)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-700">
                      {bean.name}
                    </h3>
                    <p className="mt-2 text-sm font-light leading-6 text-slate-500">
                      {bean.origin} | {bean.roastLevel} | {bean.process}
                    </p>
                  </div>
                  <time className="text-xs font-mono tabular-nums text-slate-500">
                    {bean.createdAt.toLocaleString("zh-TW")}
                  </time>
                </div>

                {bean.notes ? (
                  <p className="mt-4 text-sm font-light leading-7 text-slate-500">
                    {bean.notes}
                  </p>
                ) : null}

                <div className="mt-6">
                  <Link
                    href={`/brew/new?beanId=${bean.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgb(99,102,241,0.24)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <Coffee className="h-4 w-4" />
                    <span>沖煮這支豆子</span>
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
