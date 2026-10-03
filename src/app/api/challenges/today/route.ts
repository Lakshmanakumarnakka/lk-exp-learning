import { getTodayChallenge } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const today = await getTodayChallenge();
  if (!today) {
    return Response.json({ error: "no_challenge_today" }, { status: 404 });
  }
  return Response.json({ data: today });
}
