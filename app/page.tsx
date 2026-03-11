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
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2 pt-4">
        <p className="text-sm font-medium text-amber-600">Dashboard</p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          CoffeeLand
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
          以豆單、沖煮與紀錄三條動線，快速完成每一杯咖啡的決策與追蹤。
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
          <Link
            key={action.title}
            href={action.href}
            className="rounded-2xl bg-white p-6 shadow-sm transition duration-150 hover:shadow-md active:scale-95"
          >
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-zinc-900">
                  {action.title}
                </h2>
                <p className="text-sm leading-6 text-zinc-600">
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
