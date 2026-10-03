"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CalendarClock, TerminalSquare } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";

const MARQUEE = [
  "typescript", "python", "go", "rust", "sql", "react", "css",
  "two-pointers", "concurrency", "window functions", "type-level",
  "caching", "closures", "recursion", "token buckets",
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({ snippet, todaySlug }: { snippet: string; todaySlug: string }) {
  return (
    <section className="noise relative overflow-hidden">
      {/* orb art */}
      <div className="pointer-events-none absolute inset-0 hero-mask">
        <Image
          src="/images/hero-orb.png"
          alt=""
          fill
          priority
          className="animate-drift object-cover opacity-55"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/20 to-ink" />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:pt-28 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-mist"
            >
              <span className="relative flex size-1.5">
                <span className="absolute size-full animate-ping rounded-full bg-acid opacity-70" />
                <span className="relative size-1.5 rounded-full bg-acid" />
              </span>
              v2.4 · docs portal · postgres-backed
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease }}
              className="mt-7 text-[clamp(2.6rem,6.2vw,4.9rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            >
              Ship one challenge.
              <br />
              <span className="text-acid">Every single day.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-mist"
            >
              DailyForge is the docs portal and control plane for developer
              challenges — author the prompt, attach the test suite, schedule
              the rotation, and let your developers hunt XP at midnight.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <Link
                href="/docs/introduction"
                className="group flex items-center gap-2.5 rounded-lg bg-acid px-6 py-3 font-semibold text-ink transition-all hover:bg-[#d9ff70] hover:shadow-[0_0_40px_-6px_rgba(200,255,61,0.55)]"
              >
                <BookOpen className="size-4.5" />
                Read the docs
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/create"
                className="flex items-center gap-2.5 rounded-lg border border-line bg-white/[0.02] px-6 py-3 font-medium text-white transition-colors hover:border-acid/40 hover:bg-acid/5"
              >
                <TerminalSquare className="size-4.5 text-acid" />
                Open the studio
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-mist/70"
            >
              <span className="flex items-center gap-2">
                <CalendarClock className="size-3.5 text-acid/80" />
                rotation: 00:00 UTC
              </span>
              <span>one slot per day</span>
              <Link
                href={`/challenges/${todaySlug}`}
                className="text-acid/90 underline decoration-acid/30 underline-offset-4 transition-colors hover:text-acid"
              >
                today&apos;s challenge →
              </Link>
            </motion.div>
          </div>

          {/* floating code window */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-3xl bg-acid/5 blur-2xl" />
            <CodeBlock
              code={snippet}
              lang="json"
              title="challenges/today.json"
              className="relative shadow-2xl shadow-black/60"
            />
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease }}
              className="absolute -left-3 -top-5 rounded-md border border-acid/30 bg-ink/90 px-3 py-1.5 font-mono text-[11px] text-acid shadow-lg backdrop-blur sm:-left-8"
            >
              GET /api/challenges/today · 200 OK
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease }}
              className="absolute -bottom-5 -right-2 rounded-md border border-line bg-ink/90 px-3 py-1.5 font-mono text-[11px] text-mist shadow-lg backdrop-blur sm:-right-6"
            >
              next publish in <span className="text-white">00:00 UTC</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* marquee */}
      <div className="relative border-y border-line bg-panel/60 py-4 backdrop-blur">
        <div className="flex w-max animate-marquee gap-0 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center" aria-hidden={k === 1}>
              {MARQUEE.map((w) => (
                <span
                  key={`${k}-${w}`}
                  className="flex items-center gap-6 px-6 font-mono text-xs uppercase tracking-[0.25em] text-mist/60"
                >
                  {w}
                  <span className="text-acid/60">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
