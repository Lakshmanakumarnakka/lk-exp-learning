import { db } from "@/db";
import { challenges, submissions, type Challenge } from "@/db/schema";
import { ensureSeeded, SEED } from "@/db/seed";
import { todayISO } from "@/lib/utils";
import { and, desc, eq, lte, sql } from "drizzle-orm";

function fallbackChallenges(opts?: {
  difficulty?: string;
  language?: string;
  includeUpcoming?: boolean;
}): Challenge[] {
  const items = [...SEED]
    .filter((challenge) =>
      opts?.includeUpcoming || challenge.publishDate <= todayISO(),
    )
    .filter((challenge) =>
      !opts?.difficulty || opts.difficulty === "all" || challenge.difficulty === opts.difficulty,
    )
    .filter((challenge) =>
      !opts?.language || opts.language === "all" || challenge.language === opts.language,
    )
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));

  return items.slice(0, 120) as Challenge[];
}

function fallbackLanguages(): string[] {
  return [...new Set(SEED.map((challenge) => challenge.language).filter((language): language is string => Boolean(language)))].sort();
}

export async function listChallenges(opts?: {
  difficulty?: string;
  language?: string;
  includeUpcoming?: boolean;
}): Promise<Challenge[]> {
  await ensureSeeded();

  try {
    const conds = [];
    if (!opts?.includeUpcoming) conds.push(lte(challenges.publishDate, todayISO()));
    if (opts?.difficulty && opts.difficulty !== "all")
      conds.push(eq(challenges.difficulty, opts.difficulty));
    if (opts?.language && opts.language !== "all")
      conds.push(eq(challenges.language, opts.language));

    return await db
      .select()
      .from(challenges)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(challenges.publishDate))
      .limit(120);
  } catch {
    return fallbackChallenges(opts);
  }
}

export async function listLanguages(): Promise<string[]> {
  await ensureSeeded();

  try {
    const rows = await db
      .selectDistinct({ language: challenges.language })
      .from(challenges)
      .orderBy(challenges.language);
    return rows.map((r) => r.language);
  } catch {
    return fallbackLanguages();
  }
}

export async function getChallengeBySlug(slug: string): Promise<Challenge | null> {
  await ensureSeeded();

  try {
    const rows = await db
      .select()
      .from(challenges)
      .where(eq(challenges.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return (fallbackChallenges().find((challenge) => challenge.slug === slug) ?? null) as Challenge | null;
  }
}

export async function getTodayChallenge(): Promise<Challenge | null> {
  await ensureSeeded();

  try {
    const rows = await db
      .select()
      .from(challenges)
      .where(lte(challenges.publishDate, todayISO()))
      .orderBy(desc(challenges.publishDate))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    const today = fallbackChallenges().find((challenge) => challenge.publishDate <= todayISO());
    return (today ?? null) as Challenge | null;
  }
}

export async function getWorldStats() {
  await ensureSeeded();

  try {
    const [row] = await db
      .select({
        total: sql<number>`count(*)::int`,
        languages: sql<number>`count(distinct ${challenges.language})::int`,
        xp: sql<number>`coalesce(sum(${challenges.xp}), 0)::int`,
      })
      .from(challenges);
    const [solved] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(submissions)
      .where(eq(submissions.status, "passed"));

    return {
      total: row?.total ?? 0,
      languages: row?.languages ?? 0,
      xp: row?.xp ?? 0,
      solved: solved?.count ?? 0,
    };
  } catch {
    const total = SEED.length;
    const languages = new Set(SEED.map((challenge) => challenge.language)).size;
    const xp = SEED.reduce((sum, challenge) => sum + Number(challenge.xp ?? 0), 0);

    return {
      total,
      languages,
      xp,
      solved: 0,
    };
  }
}
