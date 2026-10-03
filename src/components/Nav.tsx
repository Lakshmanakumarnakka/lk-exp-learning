"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Code2, Menu, Plus, Terminal, X } from "lucide-react";
import { cx } from "@/lib/utils";

const LINKS = [
  { href: "/docs/introduction", label: "Docs", match: "/docs" },
  { href: "/challenges", label: "Challenges", match: "/challenges" },
  { href: "/create", label: "Studio", match: "/create" },
  { href: "/docs/api-reference", label: "API", match: "/docs/api-reference" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-acid text-ink transition-transform duration-300 group-hover:rotate-6">
            <Terminal className="size-4.5" strokeWidth={2.4} />
          </span>
          <span className="font-mono text-[15px] font-semibold tracking-tight">
            daily<span className="text-acid">forge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active =
              l.match === "/docs/api-reference"
                ? pathname === l.match
                : pathname.startsWith(l.match) &&
                  !(l.match === "/docs" && pathname === "/docs/api-reference");
            const apiActive =
              l.href === "/docs/api-reference" && pathname === "/docs/api-reference";
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active || apiActive
                    ? "bg-white/8 text-white"
                    : "text-mist hover:bg-white/5 hover:text-white",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <Link
            href="/docs/api-reference"
            className="grid size-9 place-items-center rounded-md border border-line text-mist transition-colors hover:border-white/25 hover:text-white"
            aria-label="API reference"
          >
            <Code2 className="size-4" />
          </Link>
          <Link
            href="/create"
            className="group flex items-center gap-2 rounded-md bg-acid px-4 py-2 text-sm font-semibold text-ink transition-all hover:bg-[#d9ff70] hover:shadow-[0_0_24px_-4px_rgba(200,255,61,0.5)]"
          >
            <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" />
            New challenge
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="ml-auto grid size-9 place-items-center rounded-md border border-line text-mist md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-ink/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-mist hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/create"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-acid px-4 py-2.5 text-sm font-semibold text-ink"
            >
              <Plus className="size-4" /> New challenge
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
