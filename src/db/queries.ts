import { db } from "@/db";
import { challenges, submissions, type Challenge } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { todayISO } from "@/lib/utils";
import { and, desc, eq, lte, sql } from "drizzle-orm";

export async function listChallenges(opts?: {
  difficulty?: string;
  language?: string;
  includeUpcoming?: boolean;
}): Promise<Challenge[]> {
  await ensureSeeded();
  const conds = [];
  if (!opts?.includeUpcoming) conds.push(lte(challenges.publishDate, todayISO()));
  if (opts?.difficulty && opts.difficulty !== "all")
    conds.push(eq(challenges.difficulty, opts.difficulty));
  if (opts?.language && opts.language !== "all")
    conds.push(eq(challenges.language, opts.language));
  return db
    .select()
    .from(challenges)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(challenges.publishDate))
    .limit(120);
}

export async function listLanguages(): Promise<string[]> {
  await ensureSeeded();
  const rows = await db
    .selectDistinct({ language: challenges.language })
    .from(challenges)
    .orderBy(challenges.language);
  return rows.map((r) => r.language);
}

export async function getChallengeBySlug(slug: string): Promise<Challenge | null> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(challenges)
    .where(eq(challenges.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getTodayChallenge(): Promise<Challenge | null> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(challenges)
    .where(lte(challenges.publishDate, todayISO()))
    .orderBy(desc(challenges.publishDate))
    .limit(1);
  return rows[0] ?? null;
}

export async function getWorldStats() {
  await ensureSeeded();
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
}
