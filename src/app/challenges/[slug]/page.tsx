import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Lightbulb, ListOrdered } from "lucide-react";
import { DifficultyBadge, LanguageChip, XpChip } from "@/components/badges";
import { CodeBlock } from "@/components/CodeBlock";
import { Inline } from "@/components/docs/Blocks";
import { Runner } from "@/components/challenges/Runner";
import { getChallengeBySlug } from "@/db/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getChallengeBySlug(slug).catch(() => null);
  if (!c) return {};
  return { title: c.title, description: c.summary };
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getChallengeBySlug(slug);
  if (!c) notFound();

  const paragraphs = c.description.split(/\n\n+/).filter(Boolean);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <Link
        href="/challenges"
        className="group inline-flex items-center gap-2 font-mono text-xs text-mist transition-colors hover:text-white"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        back to archive
      </Link>

      {/* header */}
      <header className="mt-8 border-b border-line pb-9">
        <div className="flex flex-wrap items-center gap-3">
          <DifficultyBadge difficulty={c.difficulty} />
          <XpChip xp={c.xp} />
          <LanguageChip language={c.language} />
          <span className="flex items-center gap-1.5 font-mono text-xs text-mist">
            <CalendarDays className="size-3.5" /> {formatDate(c.publishDate)}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-mist">
            <Clock className="size-3.5" /> ~{c.estimatedMinutes} min
          </span>
        </div>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
          {c.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mist">{c.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {c.tags.map((t) => (
            <span
              key={t}
              className="rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-mist"
            >
              #{t}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
        {/* brief */}
        <article className="min-w-0">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
            {"//"} the brief
          </h2>
          <div className="mt-5 space-y-5">
            {paragraphs.map((p, i) =>
              p.startsWith("Hint:") ? (
                <div
                  key={i}
                  className="flex gap-3.5 rounded-xl border border-acid/25 bg-acid/[0.05] p-4"
                >
                  <Lightbulb className="mt-0.5 size-4.5 shrink-0 text-acid" />
                  <p className="text-sm leading-relaxed text-[#d5e8b0]">
                    <Inline text={p.replace(/^Hint:\s*/, "")} />
                  </p>
                </div>
              ) : (
                <p key={i} className="leading-[1.8] text-[#bfc8d2]">
                  <Inline text={p} />
                </p>
              ),
            )}
          </div>

          {c.constraints.length > 0 && (
            <>
              <h2 className="mt-12 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
                <ListOrdered className="size-3.5" /> {"//"} constraints
              </h2>
              <ol className="mt-5 space-y-2.5 [counter-reset:item]">
                {c.constraints.map((con, i) => (
                  <li
                    key={i}
                    className="flex gap-3.5 rounded-lg border border-line bg-panel px-4 py-3 text-sm leading-relaxed text-mist [counter-increment:item]"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white/[0.04] font-mono text-[11px] text-acid before:content-[counter(item,decimal-leading-zero)]" />
                    <Inline text={con} />
                  </li>
                ))}
              </ol>
            </>
          )}

          {c.examples.length > 0 && (
            <>
              <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
                {"//"} examples
              </h2>
              <div className="mt-5 space-y-5">
                {c.examples.map((ex, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-line">
                    <p className="border-b border-line bg-white/[0.02] px-4 py-2 font-mono text-[11px] text-mist/70">
                      example {i + 1}
                    </p>
                    <div className="bg-panel px-4 py-3.5 font-mono text-[13px] leading-relaxed">
                      <p className="text-mist">
                        <span className="mr-2 text-[#5b6577]">in</span>
                        <span className="text-[#a8e07a]">{ex.input}</span>
                      </p>
                      <p className="mt-1.5 text-mist">
                        <span className="mr-2 text-[#5b6577]">out</span>
                        <span className="text-white">{ex.output}</span>
                      </p>
                      {ex.explanation && (
                        <p className="mt-2.5 border-t border-line/60 pt-2.5 font-sans text-sm text-mist/90">
                          {ex.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {c.testCases.length > 0 &&
            (() => {
              const prefix =
                c.language === "Python" ? "#" : c.language === "SQL" ? "--" : "//";
              const ext =
                c.language === "Python"
                  ? "py"
                  : c.language === "SQL"
                    ? "sql"
                    : c.language === "Rust"
                      ? "rs"
                      : c.language === "Go"
                        ? "go"
                        : "ts";
              return (
                <>
                  <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
                    {"//"} the public suite
                  </h2>
                  <div className="mt-5">
                    <CodeBlock
                      lang={c.language}
                      title={`suite.${ext}`}
                      code={c.testCases
                        .map((t) => `${prefix} ${t.name}\n${t.code}`)
                        .join("\n\n")}
                    />
                  </div>
                </>
              );
            })()}
        </article>

        {/* runner */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
            {"//"} your move
          </h2>
          <Runner
            challengeId={c.id}
            starterCode={c.starterCode}
            language={c.language}
            testCases={c.testCases}
            expectedTokens={c.expectedTokens}
          />
          <div className="mt-5 rounded-xl border border-line bg-panel p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/60">
              judging notes
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mist">
              <li>· The harness checks for the expected tokens and a real diff from the starter.</li>
              <li>· First passing run awards {c.xp} XP; retries are free.</li>
              <li>· Every run is stored as a submission receipt.</li>
            </ul>
            <Link
              href="/docs/test-harness"
              className="group mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-acid"
            >
              how judging works
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
