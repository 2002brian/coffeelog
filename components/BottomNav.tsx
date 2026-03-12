"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bean,
  Compass,
  Droplets,
  FlaskConical,
  Microscope,
  type LucideIcon,
} from "lucide-react";

const items = [
  { href: "/", icon: Compass, label: "首頁" },
  { href: "/beans", icon: Bean, label: "豆單" },
  { href: "/equipment", icon: FlaskConical, label: "器具" },
  { href: "/brew/new", icon: Droplets, label: "沖煮" },
  { href: "/records", icon: Microscope, label: "紀錄" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/brew/new") {
    return pathname === "/brew" || pathname.startsWith("/brew/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-full border border-white/80 bg-white/70 px-6 py-4 shadow-[0_20px_40px_rgb(51,68,85,0.1)] backdrop-blur-2xl">
      <div className="flex items-center justify-around gap-2">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon as LucideIcon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition-all duration-300 active:scale-95 ${
                active
                  ? "bg-white/70 text-slate-700 shadow-[0_8px_30px_rgb(51,68,85,0.08)]"
                  : "text-slate-500 hover:-translate-y-0.5 hover:text-slate-700"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  active ? "scale-110 stroke-[2.4] text-violet-500" : "stroke-2"
                }`}
              />
              <span className={active ? "font-semibold" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
