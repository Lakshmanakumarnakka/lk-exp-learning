import { db } from "@/db";
import { challenges, DIFFICULTIES } from "@/db/schema";
import { listChallenges } from "@/db/queries";
import { DIFF_META, slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const difficulty = url.searchParams.get("difficulty") ?? undefined;
  const language = url.searchParams.get("language") ?? undefined;
  const upcoming = url.searchParams.get("upcoming") === "true";
  const data = await listChallenges({ difficulty, language, includeUpcoming: upcoming });
  return Response.json({ data, meta: { count: data.length } });
}

function asStringArray(v: unknown, max: number): string[] | null {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) return null;
  const arr = v.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  return arr.slice(0, max).map((s) => s.trim());
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const detail: Record<string, string[]> = {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title.length < 4 || title.length > 120) detail.title = ["Required, 4–120 characters"];
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  if (!summary || summary.length > 200) detail.summary = ["Required, max 200 characters"];
  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (description.length < 40) detail.description = ["Required, min 40 characters"];
  const difficulty = typeof body.difficulty === "string" ? body.difficulty : "";
  if (!(DIFFICULTIES as readonly string[]).includes(difficulty))
    detail.difficulty = [`One of: ${DIFFICULTIES.join(", ")}`];
  const language = typeof body.language === "string" ? body.language.trim() : "";
  if (!language) detail.language = ["Required"];
  const publishDate = typeof body.publishDate === "string" ? body.publishDate : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate))
    detail.publishDate = ["Required, format YYYY-MM-DD"];

  const xp = body.xp === undefined ? DIFF_META[difficulty]?.xp ?? 50 : Number(body.xp);
  if (!Number.isInteger(xp) || xp < 0 || xp > 1000) detail.xp = ["Integer 0–1000"];
  const estimatedMinutes =
    body.estimatedMinutes === undefined ? 15 : Number(body.estimatedMinutes);
  if (!Number.isInteger(estimatedMinutes) || estimatedMinutes < 1 || estimatedMinutes > 240)
    detail.estimatedMinutes = ["Integer 1–240"];

  const tags = asStringArray(body.tags, 6);
  if (tags === null) detail.tags = ["Must be an array of strings"];
  const constraints = asStringArray(body.constraints, 12);
  if (constraints === null) detail.constraints = ["Must be an array of strings"];
  const expectedTokens = asStringArray(body.expectedTokens, 8);
  if (expectedTokens === null) detail.expectedTokens = ["Must be an array of strings"];

  let testCases: { name: string; code: string }[] = [];
  if (body.testCases !== undefined) {
    if (!Array.isArray(body.testCases)) {
      detail.testCases = ["Must be an array of { name, code }"];
    } else {
      testCases = (body.testCases as unknown[]).flatMap((t) => {
        if (
          typeof t === "object" && t !== null &&
          typeof (t as { name?: unknown }).name === "string" &&
          typeof (t as { code?: unknown }).code === "string" &&
          (t as { name: string }).name.trim() &&
          (t as { code: string }).code.trim()
        ) {
          return [{
            name: (t as { name: string }).name.trim(),
            code: (t as { code: string }).code.trim(),
          }];
        }
        return [];
      }).slice(0, 12);
    }
  }

  let examples: { input: string; output: string; explanation?: string }[] = [];
  if (Array.isArray(body.examples)) {
    examples = (body.examples as unknown[]).flatMap((e) => {
      if (
        typeof e === "object" && e !== null &&
        typeof (e as { input?: unknown }).input === "string" &&
        typeof (e as { output?: unknown }).output === "string"
      ) {
        const ex = e as { input: string; output: string; explanation?: string };
        return [{
          input: ex.input, output: ex.output,
          ...(typeof ex.explanation === "string" ? { explanation: ex.explanation } : {}),
        }];
      }
      return [];
    }).slice(0, 4);
  }

  if (Object.keys(detail).length > 0) {
    return Response.json({ error: "validation_failed", detail }, { status: 422 });
  }

  const base = slugify(title) || "challenge";
  let slug = base;
  for (let i = 2; ; i++) {
    const existing = await db
      .select({ id: challenges.id })
      .from(challenges)
      .where(eq(challenges.slug, slug))
      .limit(1);
    if (existing.length === 0) break;
    slug = `${base}-${i}`;
  }

  const [created] = await db
    .insert(challenges)
    .values({
      slug,
      title,
      summary,
      description,
      difficulty,
      language,
      xp,
      estimatedMinutes,
      tags: tags ?? [],
      constraints: constraints ?? [],
      examples,
      starterCode: typeof body.starterCode === "string" ? body.starterCode : "",
      expectedTokens: expectedTokens ?? [],
      testCases,
      publishDate,
    })
    .returning();

  return Response.json({ data: created }, { status: 201 });
}
