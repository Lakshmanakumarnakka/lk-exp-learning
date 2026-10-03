import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import type { DocBlock } from "@/lib/docs";
import { CodeBlock } from "@/components/CodeBlock";
import { cx } from "@/lib/utils";

const INLINE_RE = /(\[[^\]]+\]\([^)\s]+\)|`[^`]+`)/g;

export function Inline({ text }: { text: string }) {
  const parts = text.split(INLINE_RE);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded-md border border-line bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.85em] text-acid/90"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          return (
            <Link
              key={i}
              href={link[2]}
              className="text-acid underline decoration-acid/30 underline-offset-4 transition-colors hover:decoration-acid"
            >
              {link[1]}
            </Link>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

const CALLOUTS = {
  tip: { icon: Lightbulb, ring: "border-acid/30", bg: "bg-acid/[0.05]", text: "text-acid" },
  note: { icon: Info, ring: "border-[#7cc7ff]/30", bg: "bg-[#7cc7ff]/[0.05]", text: "text-[#7cc7ff]" },
  warn: { icon: TriangleAlert, ring: "border-[#ffd866]/30", bg: "bg-[#ffd866]/[0.05]", text: "text-[#ffd866]" },
} as const;

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="text-lg leading-relaxed text-[#c6ced8]">
          <Inline text={block.text} />
        </p>
      );
    case "p":
      return (
        <p className="leading-relaxed text-mist">
          <Inline text={block.text} />
        </p>
      );
    case "h2":
      return (
        <h2
          id={block.id}
          className="group mt-14 flex scroll-mt-28 items-baseline gap-3 text-2xl font-semibold tracking-tight text-white"
        >
          <span className="font-mono text-base text-acid/60">#</span>
          {block.text}
          <a
            href={`#${block.id}`}
            aria-label={`Link to ${block.text}`}
            className="font-mono text-sm text-mist/0 transition-colors group-hover:text-mist/60"
          >
            §
          </a>
        </h2>
      );
    case "h3":
      return (
        <h3 id={block.id} className="mt-10 scroll-mt-28 text-lg font-semibold tracking-tight text-white">
          {block.text}
        </h3>
      );
    case "code":
      return <CodeBlock code={block.code} lang={block.lang} title={block.title} />;
    case "callout": {
      const c = CALLOUTS[block.variant];
      return (
        <div className={cx("flex gap-4 rounded-xl border p-5", c.ring, c.bg)}>
          <c.icon className={cx("mt-0.5 size-5 shrink-0", c.text)} strokeWidth={1.9} />
          <div>
            <p className={cx("text-sm font-semibold", c.text)}>{block.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-mist">
              <Inline text={block.text} />
            </p>
          </div>
        </div>
      );
    }
    case "list":
      return block.ordered ? (
        <ol className="space-y-2.5 [counter-reset:item]">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3.5 text-[15px] leading-relaxed text-mist [counter-increment:item]">
              <span className="mt-0.5 grid size-6 shrink-0 select-none place-items-center rounded-md border border-line bg-white/[0.03] font-mono text-[11px] text-acid before:content-[counter(item)]" />
              <span>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3.5 text-[15px] leading-relaxed text-mist">
              <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-acid/70" />
              <span>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="code-scroll overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-white/[0.03]">
                {block.head.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-mist"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-line/60 last:border-0">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={cx(
                        "px-4 py-3 align-top leading-relaxed",
                        j === 0 ? "font-mono text-[13px] text-acid/90" : "text-mist",
                      )}
                    >
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "api": {
      const internal = block.path.startsWith("/") && !block.path.startsWith("/api");
      const content = (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3.5 transition-colors hover:border-acid/30">
          <span
            className={cx(
              "rounded-md px-2 py-1 font-mono text-[11px] font-bold",
              block.method === "GET"
                ? "bg-[#7ee787]/10 text-[#7ee787]"
                : "bg-acid/10 text-acid",
            )}
          >
            {block.method}
          </span>
          <code className="font-mono text-[13px] text-white">{block.path}</code>
          <span className="w-full text-sm text-mist sm:ml-auto sm:w-auto sm:max-w-[55%] sm:text-right">
            {block.desc}
          </span>
        </div>
      );
      return internal ? <Link href={block.path}>{content}</Link> : content;
    }
    default:
      return null;
  }
}

export function DocBlocks({ blocks }: { blocks: DocBlock[] }): ReactNode {
  return (
    <div className="space-y-7">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}
