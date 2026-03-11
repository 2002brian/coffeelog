"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: "⌂", label: "首頁" },
  { href: "/beans", icon: "◦", label: "豆單" },
  { href: "/brew/new", icon: "☕", label: "沖煮" },
  { href: "/records", icon: "◎", label: "紀錄" },
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
      <div className="mx-auto grid max-w-4xl grid-cols-4 px-3 py-2">
        {items.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition active:scale-95 ${
                active
                  ? "text-amber-600"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <span
                className={`text-lg leading-none ${
                  active ? "scale-110" : ""
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
