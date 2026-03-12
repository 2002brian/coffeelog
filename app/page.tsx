import Link from "next/link";
import {
  Bean,
  Droplets,
  FlaskConical,
  Microscope,
  Plus,
  type LucideIcon,
} from "lucide-react";

type Action = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function HomePage() {
  const actions: Action[] = [
    {
      href: "/beans",
      icon: Plus,
      title: "新增咖啡豆",
      description: "建立新的豆單資料，作為後續沖煮的基礎。",
    },
    {
      href: "/beans",
      icon: Bean,
      title: "我的豆單",
      description: "查看所有咖啡豆並快速開始一支豆子的沖煮。",
    },
    {
      href: "/equipment",
      icon: FlaskConical,
      title: "沖煮器具",
      description: "整理濾杯、磨豆機與手沖壺等器具資料。",
    },
    {
      href: "/brew/new",
      icon: Droplets,
      title: "開始沖煮",
      description: "記錄本次參數與感官評分，建立可回顧的歷史。",
    },
    {
      href: "/records",
      icon: Microscope,
      title: "歷史紀錄",
      description: "檢視所有沖煮紀錄，追蹤表現與調整方向。",
    },
  ];

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
      <header className="space-y-3 pt-4">
        <p className="text-sm font-medium text-slate-500">Dashboard</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-700 sm:text-6xl">
          CoffeeLand
        </h1>
        <p className="max-w-2xl text-base font-light leading-7 text-slate-500">
          以豆單、沖煮與紀錄三條動線，快速完成每一杯咖啡的決策與追蹤。
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="rounded-[24px] border border-white/80 bg-white/60 p-8 shadow-[0_8px_30px_rgb(51,68,85,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(51,68,85,0.1)] active:scale-95"
            >
              <div className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 text-violet-500">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-700">
                    {action.title}
                  </h2>
                  <p className="text-sm font-normal leading-7 text-slate-500">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
