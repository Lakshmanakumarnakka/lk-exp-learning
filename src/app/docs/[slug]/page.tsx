import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { DocBlocks } from "@/components/docs/Blocks";
import { DOC_PAGES, getDocNeighbors, getDocPage } from "@/lib/docs";

export function generateStaticParams() {
  return DOC_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) notFound();

  const { prev, next } = getDocNeighbors(slug);
  const toc = page.blocks.filter(
    (b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2",
  );

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_190px] xl:gap-12">
      <article>
        <header className="border-b border-line pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
            {"//"} {page.group}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em] sm:text-[2.75rem] sm:leading-[1.05]">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-mist">
            {page.description}
          </p>
          <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-mist/60">
            <Clock className="size-3.5" /> {page.minutes} min read
          </p>
        </header>

        <div className="mt-9">
          <DocBlocks blocks={page.blocks} />
        </div>

        <nav className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="card-hover group rounded-xl border border-line bg-panel p-5"
            >
              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-mist/60">
                <ArrowLeft className="size-3.5" /> previous
              </span>
              <span className="mt-1.5 block font-medium text-white group-hover:text-acid">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/docs/${next.slug}`}
              className="card-hover group rounded-xl border border-line bg-panel p-5 text-right"
            >
              <span className="flex items-center justify-end gap-1.5 font-mono text-[11px] uppercase tracking-wider text-mist/60">
                next <ArrowRight className="size-3.5" />
              </span>
              <span className="mt-1.5 block font-medium text-white group-hover:text-acid">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </article>

      {toc.length > 0 && (
        <aside className="sticky top-24 hidden h-fit xl:block">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist/60">
            on this page
          </p>
          <ul className="mt-4 space-y-2 border-l border-line">
            {toc.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="-ml-px block border-l-2 border-transparent py-0.5 pl-4 text-[13px] text-mist transition-colors hover:border-acid hover:text-white"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
