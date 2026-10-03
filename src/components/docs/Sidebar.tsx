"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DOC_GROUPS } from "@/lib/docs";
import { cx } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = DOC_GROUPS.flatMap((g) =>
    g.pages.map((p) => ({ ...p, group: g.group })),
  ).find((p) => pathname.endsWith(`/docs/${p.slug}`));

  return (
    <>
      {/* mobile */}
      <div className="sticky top-16 z-30 -mx-5 border-b border-line bg-ink/90 px-5 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-line bg-panel px-4 py-2.5 text-sm"
        >
          <span className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-acid">
              {active?.group ?? "docs"}
            </span>
            <span className="text-white">{active?.title ?? "Select a page"}</span>
          </span>
          <ChevronDown
            className={cx("size-4 text-mist transition-transform", open && "rotate-180")}
          />
        </button>
        {open && (
          <nav className="mt-2 max-h-[60vh] overflow-y-auto rounded-lg border border-line bg-panel p-2">
            {DOC_GROUPS.map((g) => (
              <div key={g.group} className="mb-2 last:mb-0">
                <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/60">
                  {g.group}
                </p>
                {g.pages.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/docs/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className={cx(
                      "block rounded-md px-3 py-2 text-sm",
                      pathname.endsWith(`/docs/${p.slug}`)
                        ? "bg-acid/10 text-acid"
                        : "text-mist hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* desktop */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto py-14 pr-2 lg:block">
        <nav>
          {DOC_GROUPS.map((g) => (
            <div key={g.group} className="mb-8">
              <p className="mb-3 flex items-center gap-2 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-mist/60">
                <span className="text-acid/70">{"//"}</span> {g.group}
              </p>
              <ul className="space-y-0.5 border-l border-line">
                {g.pages.map((p) => {
                  const isActive = pathname.endsWith(`/docs/${p.slug}`);
                  return (
                    <li key={p.slug}>
                      <Link
                        href={`/docs/${p.slug}`}
                        className={cx(
                          "-ml-px block border-l-2 py-1.5 pl-4 pr-2 text-sm transition-colors",
                          isActive
                            ? "border-acid font-medium text-acid"
                            : "border-transparent text-mist hover:border-white/25 hover:text-white",
                        )}
                      >
                        {p.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="rounded-xl border border-line bg-panel p-4">
            <p className="font-mono text-[11px] text-mist">skip the reading:</p>
            <Link
              href="/create"
              className="mt-2 block text-sm font-medium text-acid hover:underline"
            >
              Open the challenge studio →
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
