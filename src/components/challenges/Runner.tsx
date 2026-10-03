"use client";

import { useState } from "react";
import { CircleCheck, CircleX, Loader2, Play, ScanSearch } from "lucide-react";
import type { ChallengeTestCase } from "@/db/schema";
import { cx } from "@/lib/utils";

type RunResult = {
  status: "passed" | "failed";
  passedTests: number;
  totalTests: number;
  xpAwarded: number;
  missing?: string[];
};

export function Runner({
  challengeId,
  starterCode,
  language,
  testCases,
  expectedTokens,
  onPassed,
}: {
  challengeId: string;
  starterCode: string;
  language: string;
  testCases: ChallengeTestCase[];
  expectedTokens: string[];
  onPassed?: () => void;
}) {
  const [code, setCode] = useState(starterCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ challengeId, code }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "run failed");
      setResult(json.data as RunResult);
      if ((json.data as RunResult).status === "passed") onPassed?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "run failed");
    } finally {
      setRunning(false);
    }
  }

  const passed = result?.status === "passed";

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#090b0d]">
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-white/[0.02] px-4 py-2.5">
        <span className="flex gap-1.5">
          <i className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <i className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <i className="size-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        <span className="font-mono text-xs text-mist/80">
          solution.{language === "Python" ? "py" : language === "Rust" ? "rs" : language === "Go" ? "go" : language === "SQL" ? "sql" : language === "CSS" ? "css" : "ts"}
        </span>
        <button
          onClick={run}
          disabled={running}
          className={cx(
            "ml-auto flex items-center gap-2 rounded-md px-4 py-1.5 font-mono text-xs font-semibold transition-all",
            running
              ? "cursor-wait bg-white/10 text-mist"
              : "bg-acid text-ink hover:bg-[#d9ff70] hover:shadow-[0_0_20px_-4px_rgba(200,255,61,0.6)]",
          )}
        >
          {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
          {running ? "judging…" : "run tests"}
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={Math.max(10, code.split("\n").length + 2)}
        className="code-scroll block w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-[1.7] text-[#d3dbe8] outline-none placeholder:text-mist/40"
        placeholder="// write your solution here"
      />

      {expectedTokens.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
          <ScanSearch className="size-3.5 text-mist/60" />
          <span className="font-mono text-[11px] text-mist/60">the harness scans for</span>
          {expectedTokens.map((t) => (
            <code
              key={t}
              className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-acid/90"
            >
              {t}
            </code>
          ))}
        </div>
      )}

      {(result || error) && (
        <div
          className={cx(
            "border-t px-4 py-4",
            passed
              ? "border-acid/30 bg-acid/[0.04]"
              : "border-[#ff7b72]/30 bg-[#ff7b72]/[0.04]",
          )}
        >
          {error ? (
            <p className="flex items-center gap-2 font-mono text-xs text-[#ff7b72]">
              <CircleX className="size-4" /> {error}
            </p>
          ) : (
            result && (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  {passed ? (
                    <CircleCheck className="size-5 text-acid" />
                  ) : (
                    <CircleX className="size-5 text-[#ff7b72]" />
                  )}
                  <p className={cx("font-mono text-sm font-semibold", passed ? "text-acid" : "text-[#ff7b72]")}>
                    {passed
                      ? `all tests passed · +${result.xpAwarded} XP`
                      : `suite failed — ${result.passedTests}/${result.totalTests} assertions`}
                  </p>
                  <span className="ml-auto font-mono text-[11px] text-mist/60">
                    receipt stored in postgres
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {testCases.map((t, i) => (
                    <li key={i} className="flex items-center gap-2.5 font-mono text-xs">
                      {passed ? (
                        <CircleCheck className="size-3.5 shrink-0 text-acid/80" />
                      ) : (
                        <CircleX className="size-3.5 shrink-0 text-[#ff7b72]/80" />
                      )}
                      <span className="text-[#c6ced8]">{t.name}</span>
                    </li>
                  ))}
                </ul>
                {!passed && result.missing && result.missing.length > 0 && (
                  <p className="mt-3 font-mono text-[11px] text-[#ff7b72]/90">
                    missing: {result.missing.join(", ")}
                  </p>
                )}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}
