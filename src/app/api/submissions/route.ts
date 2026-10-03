import { db } from "@/db";
import { challenges, submissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { challengeId?: unknown; code?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const challengeId = typeof body.challengeId === "string" ? body.challengeId : "";
  const code = typeof body.code === "string" ? body.code : "";
  if (!challengeId) {
    return Response.json({ error: "validation_failed", detail: { challengeId: ["Required"] } }, { status: 422 });
  }
  if (code.trim().length < 5) {
    return Response.json(
      { error: "validation_failed", detail: { code: ["Min 5 characters"] } },
      { status: 422 },
    );
  }

  const [challenge] = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .limit(1);
  if (!challenge) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const haystack = code.toLowerCase();
  const missing = challenge.expectedTokens.filter(
    (t) => !haystack.includes(t.toLowerCase()),
  );
  const changedFromStarter =
    code.replace(/\s+/g, " ").trim() !==
      challenge.starterCode.replace(/\s+/g, " ").trim() || !challenge.starterCode;

  const passed = missing.length === 0 && changedFromStarter;
  const totalTests = challenge.testCases.length;
  const passedTests = passed ? totalTests : 0;

  const [receipt] = await db
    .insert(submissions)
    .values({
      challengeId: challenge.id,
      code,
      status: passed ? "passed" : "failed",
      passedTests,
      totalTests,
      xpAwarded: passed ? challenge.xp : 0,
    })
    .returning();

  return Response.json({
    data: {
      id: receipt.id,
      status: receipt.status,
      passedTests: receipt.passedTests,
      totalTests: receipt.totalTests,
      xpAwarded: receipt.xpAwarded,
      ...(passed ? {} : { missing }),
    },
  });
}
