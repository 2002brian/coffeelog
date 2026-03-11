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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-stretch justify-around px-2 py-2">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon as LucideIcon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition active:scale-95 ${
                active
                  ? "text-amber-600"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  active ? "scale-110 stroke-[2.4]" : "stroke-2"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
