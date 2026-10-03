import { getChallengeBySlug } from "@/db/queries";
import { todayISO } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);
  if (!challenge || challenge.publishDate > todayISO()) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json({ data: challenge });
}
