import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Inbox } from "lucide-react";
import { DifficultyBadge, LanguageChip, SectionLabel, XpChip } from "@/components/badges";
import { Reveal } from "@/components/Reveal";
import { listChallenges, listLanguages } from "@/db/queries";
import { cx, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Challenge archive",
  description: "Every published daily developer challenge — filter by difficulty and language.",
};

const DIFFS = ["all", "easy", "medium", "hard", "expert"];

export default async function ChallengesPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string; language?: string }>;
}) {
  const { difficulty = "all", language = "all" } = await searchParams;
  const [challenges, languages] = await Promise.all([
    listChallenges({ difficulty, language }),
    listLanguages(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <Reveal>
        <SectionLabel index="ar" text="the archive" />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
            Every published daily
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-mist">
            One slot per day, dated in UTC. Future slots stay hidden until the
            rotation flips — no spoilers.
          </p>
        </div>
      </Reveal>

      {/* filters */}
      <Reveal delay={0.08}>
        <div className="mt-10 flex flex-wrap items-center gap-6 border-y border-line py-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-mist/60">
              difficulty
            </span>
            {DIFFS.map((d) => (
              <Link
                key={d}
                href={`/challenges?difficulty=${d}&language=${language}`}
                className={cx(
                  "rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
                  difficulty === d
                    ? "bg-acid font-semibold text-ink"
                    : "text-mist hover:bg-white/5 hover:text-white",
                )}
              >
                {d}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-mist/60">
              language
            </span>
            {["all", ...languages].map((l) => (
              <Link
                key={l}
                href={`/challenges?difficulty=${difficulty}&language=${l}`}
                className={cx(
                  "rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
                  language === l
                    ? "bg-white font-semibold text-ink"
                    : "text-mist hover:bg-white/5 hover:text-white",
                )}
              >
                {l}
              </Link>
            ))}
          </div>
          <span className="ml-auto font-mono text-xs text-mist/60">
            {challenges.length} result{challenges.length === 1 ? "" : "s"}
          </span>
        </div>
      </Reveal>

      {/* grid */}
      {challenges.length === 0 ? (
        <div className="mt-20 flex flex-col items-center py-16 text-center">
          <Inbox className="size-8 text-mist/40" />
          <p className="mt-4 font-mono text-sm text-mist">
            nothing published with these filters — yet
          </p>
          <Link href="/create" className="mt-4 text-sm text-acid hover:underline">
            Schedule the first one →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {challenges.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.06} className="h-full">
              <Link
                href={`/challenges/${c.slug}`}
                className="card-hover group flex h-full flex-col rounded-xl border border-line bg-panel p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-mist/60">
                    {formatDate(c.publishDate)}
                  </span>
                  <DifficultyBadge difficulty={c.difficulty} />
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-acid">
                  {c.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist">
                  {c.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[10.5px] text-mist/80"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-4 [margin-top:auto]">
                  <LanguageChip language={c.language} />
                  <XpChip xp={c.xp} />
                  <span className="flex items-center gap-1 font-mono text-[11px] text-mist/70">
                    <Clock className="size-3" /> {c.estimatedMinutes}m
                  </span>
                  <ArrowRight className="ml-auto size-4 text-mist/40 transition-all group-hover:translate-x-1 group-hover:text-acid" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
