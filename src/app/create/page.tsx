"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleCheck,
  CircleX,
  FlaskConical,
  Loader2,
  Plus,
  Send,
  Trash2,
  Wand2,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { SectionLabel } from "@/components/badges";
import { DIFF_META, cx } from "@/lib/utils";

const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "SQL", "React", "CSS", "Other",
];
const DIFFS = ["easy", "medium", "hard", "expert"] as const;

type TestRow = { name: string; code: string };

type FormState = {
  title: string;
  summary: string;
  description: string;
  difficulty: (typeof DIFFS)[number];
  language: string;
  publishDate: string;
  xp: string;
  estimatedMinutes: string;
  tags: string;
  constraints: string;
  expectedTokens: string;
  starterCode: string;
  tests: TestRow[];
};

const initial: FormState = {
  title: "",
  summary: "",
  description: "",
  difficulty: "easy",
  language: "TypeScript",
  publishDate: "",
  xp: "50",
  estimatedMinutes: "15",
  tags: "",
  constraints: "",
  expectedTokens: "",
  starterCode: "",
  tests: [{ name: "", code: "" }],
};

const input =
  "w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-mist/40 focus:border-acid/50 focus:bg-panel2";
const label = "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-mist/70";

export default function CreatePage() {
  const router = useRouter();
  const [f, setF] = useState<FormState>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Record<string, string[] | string> | string | null>(null);
  const [created, setCreated] = useState<{ slug: string; title: string } | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setF((s) => ({ ...s, [k]: v }));

  const payload = useMemo(() => {
    const obj: Record<string, unknown> = {
      title: f.title || undefined,
      summary: f.summary || undefined,
      description: f.description || undefined,
      difficulty: f.difficulty,
      language: f.language,
      publishDate: f.publishDate || undefined,
    };
    if (f.xp && Number(f.xp) !== DIFF_META[f.difficulty].xp) obj.xp = Number(f.xp);
    if (f.estimatedMinutes) obj.estimatedMinutes = Number(f.estimatedMinutes);
    const tags = f.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (tags.length) obj.tags = tags;
    const cons = f.constraints.split("\n").map((c) => c.trim()).filter(Boolean);
    if (cons.length) obj.constraints = cons;
    const toks = f.expectedTokens.split(",").map((t) => t.trim()).filter(Boolean);
    if (toks.length) obj.expectedTokens = toks;
    if (f.starterCode.trim()) obj.starterCode = f.starterCode;
    const tests = f.tests.filter((t) => t.name.trim() && t.code.trim());
    if (tests.length) obj.testCases = tests;
    return obj;
  }, [f]);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.detail ?? json.error ?? "validation failed");
        return;
      }
      setCreated({ slug: json.data.slug, title: json.data.title });
    } catch {
      setError("network error — is the server up?");
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center">
        <span className="glow-acid grid size-16 place-items-center rounded-2xl border border-acid/30 bg-acid/10">
          <CircleCheck className="size-8 text-acid" />
        </span>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
          Scheduled.
        </h1>
        <p className="mt-4 max-w-md text-mist">
          <span className="text-white">{created.title}</span> is on the calendar.
          It goes live when the rotation reaches its publish date.
        </p>
        <div className="mt-3 rounded-lg border border-line bg-panel px-4 py-2 font-mono text-sm text-acid">
          /challenges/{created.slug}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={() =>
              created && router.push(`/challenges/${created.slug}`)
            }
            className="group flex items-center gap-2 rounded-lg bg-acid px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-[#d9ff70]"
          >
            View the challenge
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => {
              setCreated(null);
              setF(initial);
            }}
            className="flex items-center gap-2 rounded-lg border border-line px-6 py-3 text-sm text-white transition-colors hover:border-acid/40 hover:bg-acid/5"
          >
            <Plus className="size-4" /> Schedule another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionLabel index="st" text="challenge studio" />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
          Write tomorrow&apos;s pain
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-mist">
          The form on the left authors the challenge. The right pane is the
          exact payload that hits <code className="text-acid/90">POST /api/challenges</code>.
        </p>
      </div>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,450px)]">
        {/* form */}
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <section className="space-y-5 rounded-xl border border-line bg-panel/50 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-acid/80">
              01 — identity
            </p>
            <div>
              <label className={label} htmlFor="title">Title</label>
              <input
                id="title"
                className={input}
                placeholder="Rate Limit the Rush"
                value={f.title}
                onChange={(e) => set("title", e.target.value)}
                maxLength={120}
              />
            </div>
            <div>
              <label className={label} htmlFor="summary">Summary — one line</label>
              <input
                id="summary"
                className={input}
                placeholder="Token bucket, from scratch — goroutines welcome."
                value={f.summary}
                onChange={(e) => set("summary", e.target.value)}
                maxLength={200}
              />
            </div>
            <div>
              <label className={label} htmlFor="description">
                Description — blank line between paragraphs, start a line with Hint: for the hint box
              </label>
              <textarea
                id="description"
                rows={6}
                className={cx(input, "font-mono text-[13px] leading-relaxed")}
                placeholder={"Your webhook endpoint melts on every deploy…\n\nImplement NewLimiter(capacity, rate)…\n\nHint: lazy refill beats a background ticker."}
                value={f.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </section>

          <section className="space-y-5 rounded-xl border border-line bg-panel/50 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-acid/80">
              02 — classification
            </p>
            <div>
              <span className={label}>Difficulty</span>
              <div className="grid grid-cols-4 gap-2">
                {DIFFS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      set("difficulty", d);
                      set("xp", String(DIFF_META[d].xp));
                    }}
                    className={cx(
                      "rounded-lg border px-3 py-2.5 font-mono text-xs capitalize transition-all",
                      f.difficulty === d
                        ? cx("bg-white/[0.06] font-semibold", DIFF_META[d].ring, DIFF_META[d].text)
                        : "border-line text-mist hover:border-white/25 hover:text-white",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="language">Language</label>
                <select
                  id="language"
                  className={input}
                  value={f.language}
                  onChange={(e) => set("language", e.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l} className="bg-panel">
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="publishDate">Publish date (UTC)</label>
                <input
                  id="publishDate"
                  type="date"
                  className={cx(input, "[color-scheme:dark]")}
                  value={f.publishDate}
                  onChange={(e) => set("publishDate", e.target.value)}
                />
              </div>
              <div>
                <label className={label} htmlFor="xp">XP — defaults to difficulty</label>
                <input
                  id="xp"
                  type="number"
                  min={0}
                  max={1000}
                  className={input}
                  value={f.xp}
                  onChange={(e) => set("xp", e.target.value)}
                />
              </div>
              <div>
                <label className={label} htmlFor="est">Estimated minutes</label>
                <input
                  id="est"
                  type="number"
                  min={1}
                  max={240}
                  className={input}
                  value={f.estimatedMinutes}
                  onChange={(e) => set("estimatedMinutes", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={label} htmlFor="tags">Tags — comma separated, max 6</label>
              <input
                id="tags"
                className={input}
                placeholder="concurrency, systems, go"
                value={f.tags}
                onChange={(e) => set("tags", e.target.value)}
              />
            </div>
          </section>

          <section className="space-y-5 rounded-xl border border-line bg-panel/50 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-acid/80">
              03 — the harness
            </p>
            <div>
              <label className={label} htmlFor="constraints">Constraints — one per line</label>
              <textarea
                id="constraints"
                rows={3}
                className={cx(input, "font-mono text-[13px]")}
                placeholder={"Allow() never blocks\nSafe for concurrent use (run with -race)"}
                value={f.constraints}
                onChange={(e) => set("constraints", e.target.value)}
              />
            </div>
            <div>
              <label className={label} htmlFor="tokens">Expected tokens — comma separated</label>
              <input
                id="tokens"
                className={input}
                placeholder="setTimeout, clearTimeout"
                value={f.expectedTokens}
                onChange={(e) => set("expectedTokens", e.target.value)}
              />
            </div>
            <div>
              <label className={label} htmlFor="starter">Starter code</label>
              <textarea
                id="starter"
                rows={5}
                spellCheck={false}
                className={cx(input, "font-mono text-[13px] leading-relaxed")}
                placeholder={"export function debounce(fn, wait) {\n  // your code here\n}"}
                value={f.starterCode}
                onChange={(e) => set("starterCode", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className={cx(label, "mb-0")}>Public test cases</span>
                <button
                  type="button"
                  onClick={() => set("tests", [...f.tests, { name: "", code: "" }])}
                  className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[11px] text-mist transition-colors hover:border-acid/40 hover:text-acid"
                >
                  <Plus className="size-3.5" /> add case
                </button>
              </div>
              <div className="space-y-3">
                {f.tests.map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-2.5 grid size-6 shrink-0 place-items-center rounded-md bg-white/[0.04] font-mono text-[11px] text-acid">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <input
                      className={cx(input, "w-2/5")}
                      placeholder="behavior name"
                      value={t.name}
                      onChange={(e) =>
                        set("tests", f.tests.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                      }
                    />
                    <input
                      className={cx(input, "flex-1 font-mono text-[12.5px]")}
                      placeholder="assert ..."
                      value={t.code}
                      onChange={(e) =>
                        set("tests", f.tests.map((x, j) => (j === i ? { ...x, code: e.target.value } : x)))
                      }
                    />
                    <button
                      type="button"
                      aria-label="Remove case"
                      onClick={() => set("tests", f.tests.filter((_, j) => j !== i))}
                      className="mt-1.5 grid size-8 shrink-0 place-items-center rounded-md border border-line text-mist/60 transition-colors hover:border-[#ff7b72]/40 hover:text-[#ff7b72]"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </form>

        {/* preview */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-acid/80">
              payload preview
            </p>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-mist/60">
              <Wand2 className="size-3.5 text-acid/70" /> live
            </span>
          </div>
          <CodeBlock
            lang="json"
            title="POST /api/challenges"
            code={JSON.stringify(payload, null, 2)}
          />
          {error && (
            <div className="flex gap-3 rounded-xl border border-[#ff7b72]/30 bg-[#ff7b72]/[0.05] p-4">
              <CircleX className="mt-0.5 size-4.5 shrink-0 text-[#ff7b72]" />
              <div className="text-sm leading-relaxed text-[#ffb4ad]">
                {typeof error === "string" ? (
                  error
                ) : (
                  <ul className="space-y-1">
                    {Object.entries(error).map(([k, v]) => (
                      <li key={k}>
                        <code className="text-white">{k}</code>:{" "}
                        {Array.isArray(v) ? v.join(", ") : String(v)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          <button
            onClick={submit}
            disabled={busy}
            className={cx(
              "group flex w-full items-center justify-center gap-2.5 rounded-lg px-6 py-3.5 font-semibold transition-all",
              busy
                ? "cursor-wait bg-white/10 text-mist"
                : "bg-acid text-ink hover:bg-[#d9ff70] hover:shadow-[0_0_36px_-6px_rgba(200,255,61,0.55)]",
            )}
          >
            {busy ? (
              <Loader2 className="size-4.5 animate-spin" />
            ) : (
              <Send className="size-4.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            )}
            {busy ? "Scheduling…" : "Schedule challenge"}
          </button>
          <p className="flex items-start gap-2 font-mono text-[11px] leading-relaxed text-mist/60">
            <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-acid/60" />
            Server-side validation applies — see the ship checklist in
            <Link href="/docs/authoring" className="text-acid/90 underline decoration-acid/30 underline-offset-4 hover:text-acid">
              authoring
            </Link>
          </p>
        </aside>
      </div>
    </main>
  );
}
