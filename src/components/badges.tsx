import { cx, DIFF_META } from "@/lib/utils";

export function SectionLabel({
  index,
  text,
  className,
}: {
  index: string;
  text: string;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-mist/70",
        className,
      )}
    >
      <span className="text-acid">{"//"}</span>
      <span>{index}</span>
      <span className="h-px w-8 bg-white/15" />
      <span>{text}</span>
    </p>
  );
}

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: string;
  className?: string;
}) {
  const meta = DIFF_META[difficulty] ?? DIFF_META.easy;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] font-medium",
        meta.ring,
        meta.text,
        className,
      )}
    >
      <span className={cx("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function LanguageChip({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-mist">
      {language}
    </span>
  );
}

export function XpChip({ xp }: { xp: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-acid/25 bg-acid/8 px-2 py-1 font-mono text-[11px] font-semibold text-acid">
      {xp} XP
    </span>
  );
}
