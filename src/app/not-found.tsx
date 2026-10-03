import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-5 py-36 text-center">
      <p className="font-mono text-sm text-mist/60">
        <span className="text-acid">throw</span> new NotFoundError(
        <span className="text-[#a8e07a]">&quot;route&quot;</span>)
      </p>
      <h1 className="mt-8 text-[clamp(4rem,14vw,9rem)] font-semibold leading-none tracking-[-0.04em]">
        4<span className="text-outline">0</span>4
      </h1>
      <p className="mt-6 max-w-sm text-mist">
        This route never made the calendar. The rotation moved on without it.
      </p>
      <Link
        href="/"
        className="group mt-10 flex items-center gap-2 rounded-lg bg-acid px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-[#d9ff70]"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        Back to base
      </Link>
    </main>
  );
}
