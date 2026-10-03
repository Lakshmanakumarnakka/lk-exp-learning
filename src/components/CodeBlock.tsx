"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { highlightCode } from "@/lib/highlight";
import { cx } from "@/lib/utils";

export function CodeBlock({
  code,
  lang,
  title,
  className,
  bare = false,
}: {
  code: string;
  lang: string;
  title?: string;
  className?: string;
  bare?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => highlightCode(code.trim(), lang), [code, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code.trim();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cx(
        "group/code overflow-hidden rounded-xl border border-line bg-[#090b0d]",
        className,
      )}
    >
      {!bare && (
        <div className="flex items-center gap-3 border-b border-line bg-white/[0.02] px-4 py-2.5">
          <span className="flex gap-1.5">
            <i className="size-2.5 rounded-full bg-[#ff5f57]/80" />
            <i className="size-2.5 rounded-full bg-[#febc2e]/80" />
            <i className="size-2.5 rounded-full bg-[#28c840]/80" />
          </span>
          {title && (
            <span className="font-mono text-xs text-mist/80">{title}</span>
          )}
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-mist/50">
            {lang}
          </span>
          <button
            onClick={copy}
            aria-label="Copy code"
            className="grid size-7 place-items-center rounded-md border border-line text-mist/70 opacity-70 transition-all hover:border-acid/40 hover:text-acid group-hover/code:opacity-100"
          >
            {copied ? (
              <Check className="size-3.5 text-acid" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>
      )}
      <pre className="code-scroll overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.7] text-[#d3dbe8] sm:text-[13px]">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
