import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Braces,
  CalendarClock,
  Clock,
  FlaskConical,
  Gauge,
  Play,
  Webhook,
} from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/Reveal";
import { CodeBlock } from "@/components/CodeBlock";
import {
  DifficultyBadge,
  LanguageChip,
  SectionLabel,
  XpChip,
} from "@/components/badges";
import { getTodayChallenge, getWorldStats } from "@/db/queries";
import { DOC_GROUPS } from "@/lib/docs";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FEATURES = [
  {
    icon: BookOpenText,
    title: "Docs that read like specs",
    body: "Field-by-field schema references, house style guides, and calibration rubrics — the docs are the product, not an afterthought.",
  },
  {
    icon: FlaskConical,
    title: "Test harness built in",
    body: "Every challenge carries a public suite and expected tokens. The runner judges submissions and stores receipts in Postgres.",
  },
  {
    icon: CalendarClock,
    title: "UTC rotation engine",
    body: "Challenges are dated, not dumped. The archive hides future slots and the today endpoint always serves exactly one date.",
  },
  {
    icon: Braces,
    title: "REST API first",
    body: "The studio is a client of the same API you script against. Create, schedule, and submit with curl — nothing private.",
  },
  {
    icon: Gauge,
    title: "XP & difficulty economy",
    body: "A four-level rubric authors calibrate against, with XP defaults and bounds baked into the schema.",
  },
  {
    icon: Webhook,
    title: "Webhooks, signed",
    body: "challenge.published and submission.passed events with HMAC-SHA256 signatures, ready for your leaderboard bot.",
  },
];

export default async function Home() {
  const [today, stats] = await Promise.all([getTodayChallenge(), getWorldStats()]);

  const snippet = today
    ? JSON.stringify(
        {
          slug: today.slug,
          title: today.title,
          difficulty: today.difficulty,
          language: today.language,
          xp: today.xp,
          publishDate: today.publishDate,
          estimatedMinutes: today.estimatedMinutes,
          tags: today.tags,
        },
        null,
        2,
      )
    : `{\n  "status": "seeding challenges…"\n}`;

  return (
    <main>
      <Hero snippet={snippet} todaySlug={today?.slug ?? "challenges"} />

      {/* stats */}
      <section className="relative border-b border-line">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-line sm:divide-x lg:grid-cols-4">
          {[
            { n: stats.total, l: "challenges on the calendar", s: "seeded & counting" },
            { n: stats.languages, l: "languages in the rotation", s: "and growing" },
            { n: `${stats.xp.toLocaleString()}`, l: "XP currently in play", s: "first-pass awards" },
            { n: stats.solved, l: "passing submissions logged", s: "receipts in postgres" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06} className="px-6 py-9 lg:px-9">
              <p className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {s.n}
              </p>
              <p className="mt-1.5 text-sm text-mist">{s.l}</p>
              <p className="mt-0.5 font-mono text-[11px] text-mist/50">{s.s}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* today */}
      {today && (
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <Reveal>
            <SectionLabel index="01" text="live on the rotation" />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="glow-acid card-hover mt-8 overflow-hidden rounded-2xl border border-line bg-panel">
              <div className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4 sm:px-8">
                <span className="flex items-center gap-2 font-mono text-xs text-acid">
                  <span className="relative flex size-1.5">
                    <span className="absolute size-full animate-ping rounded-full bg-acid opacity-70" />
                    <span className="relative size-1.5 rounded-full bg-acid" />
                  </span>
                  now live
                </span>
                <span className="font-mono text-xs text-mist/60">
                  {formatDate(today.publishDate)} · one slot per day
                </span>
                <span className="ml-auto flex items-center gap-2">
                  <DifficultyBadge difficulty={today.difficulty} />
                  <XpChip xp={today.xp} />
                </span>
              </div>
              <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-10">
                <div>
                  <div className="flex items-center gap-3">
                    <LanguageChip language={today.language} />
                    <span className="flex items-center gap-1.5 font-mono text-xs text-mist">
                      <Clock className="size-3.5" /> ~{today.estimatedMinutes} min
                    </span>
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {today.title}
                  </h2>
                  <p className="mt-3 max-w-lg leading-relaxed text-mist">
                    {today.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {today.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-mist"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={`/challenges/${today.slug}`}
                      className="group flex items-center gap-2 rounded-lg bg-acid px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-[#d9ff70]"
                    >
                      <Play className="size-4" />
                      Solve it now
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/challenges"
                      className="flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-sm text-white transition-colors hover:border-acid/40 hover:bg-acid/5"
                    >
                      Browse the archive
                    </Link>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mist/50">
                    starter — {today.language.toLowerCase() === "sql" ? "query.sql" : "solution.*"}
                  </p>
                  <CodeBlock
                    code={today.starterCode || "// no starter attached — start from a blank buffer"}
                    lang={today.language}
                    bare
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* features */}
      <section className="border-t border-line py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionLabel index="02" text="the machinery" />
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
                Everything between the idea and the streak
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-mist">
                Authoring, testing, scheduling, scoring — the unglamorous parts
                of a daily challenge program, made delightful.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.07}>
                <div className="card-hover group h-full rounded-xl border border-line bg-panel p-6">
                  <div className="flex size-11 items-center justify-center rounded-lg border border-line bg-white/[0.03] text-acid transition-colors group-hover:border-acid/40">
                    <f.icon className="size-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* docs */}
      <section className="border-t border-line py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionLabel index="03" text="the docs" />
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
                Read it like a runbook
              </h2>
              <Link
                href="/docs/introduction"
                className="group flex items-center gap-1.5 font-mono text-sm text-acid"
              >
                all docs
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {DOC_GROUPS.map((g, gi) => (
              <Reveal key={g.group} delay={gi * 0.06}>
                <div className="card-hover h-full rounded-xl border border-line bg-panel p-6 sm:p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-acid/80">
                    {g.group}
                  </p>
                  <ul className="mt-5 space-y-1">
                    {g.pages.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/docs/${p.slug}`}
                          className="group flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                        >
                          <span className="text-[15px] font-medium text-white/90 group-hover:text-white">
                            {p.title}
                          </span>
                          <span className="flex items-center gap-2 font-mono text-[11px] text-mist/60">
                            {p.minutes} min
                            <ArrowRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* api preview */}
      <section className="border-t border-line py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionLabel index="04" text="api first" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
                Script the whole calendar with curl
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-mist">
                The studio, the archive, and this page are all clients of the
                same REST API. Schedule a season by looping over a JSON file —
                the server handles slugs, defaults, and validation.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "One slot per day, future dates stay hidden",
                  "Slugs derived server-side, collisions suffixed",
                  "Submissions judged and receipted in Postgres",
                  "Errors as { error, detail } — never HTML",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3 text-sm text-mist">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-acid" />
                    {li}
                  </li>
                ))}
              </ul>
              <Link
                href="/docs/api-reference"
                className="group mt-8 inline-flex items-center gap-2 rounded-lg border border-acid/40 bg-acid/5 px-5 py-2.5 text-sm font-medium text-acid transition-colors hover:bg-acid/10"
              >
                Full API reference
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-4">
                <CodeBlock
                  lang="bash"
                  title="terminal"
                  code={`curl -s -X POST http://localhost:3000/api/challenges \\
  -H 'content-type: application/json' \\
  -d '{
    "title": "Normalize the Phone Numbers",
    "difficulty": "medium",
    "language": "Python",
    "publishDate": "2026-03-04"
  }'`}
                />
                <CodeBlock
                  lang="json"
                  title="response — 201 Created"
                  code={`{
  "data": {
    "slug": "normalize-the-phone-numbers",
    "publishDate": "2026-03-04",
    "xp": 150
  }
}`}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-28 text-center lg:px-8">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-acid">
              {"// zero excuses"}
            </p>
            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.02em] sm:text-6xl">
              Tomorrow&apos;s slot is still <span className="text-outline">empty</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-mist">
              Open the studio, write twenty minutes of pain for your friends,
              and schedule it before the rotation flips.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/create"
                className="group flex items-center gap-2.5 rounded-lg bg-acid px-7 py-3.5 font-semibold text-ink transition-all hover:bg-[#d9ff70] hover:shadow-[0_0_40px_-6px_rgba(200,255,61,0.55)]"
              >
                Create a challenge
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/docs/quickstart"
                className="rounded-lg border border-line px-7 py-3.5 font-medium text-white transition-colors hover:border-acid/40 hover:bg-acid/5"
              >
                5-minute quickstart
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
