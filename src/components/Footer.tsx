import Link from "next/link";
import { Terminal } from "lucide-react";
import { DOC_GROUPS } from "@/lib/docs";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-acid text-ink">
                <Terminal className="size-4.5" strokeWidth={2.4} />
              </span>
              <span className="font-mono text-[15px] font-semibold tracking-tight">
                daily<span className="text-acid">forge</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">
              A docs portal and control plane for shipping one developer
              challenge every day. Write once, schedule, ship forever.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs text-mist">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-acid opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-acid" />
              </span>
              all systems nominal
            </div>
          </div>

          {DOC_GROUPS.map((g) => (
            <div key={g.group}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist/70">
                {g.group}
              </p>
              <ul className="mt-4 space-y-2.5">
                {g.pages.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/docs/${p.slug}`}
                      className="text-sm text-mist transition-colors hover:text-acid"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-mist/60">
            © 2026 dailyforge — ship daily, or it didn&apos;t happen
          </p>
          <div className="flex items-center gap-5 font-mono text-xs text-mist/60">
            <Link href="/challenges" className="transition-colors hover:text-white">
              challenges
            </Link>
            <Link href="/create" className="transition-colors hover:text-white">
              studio
            </Link>
            <Link href="/api/health" className="transition-colors hover:text-white">
              /api/health
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
