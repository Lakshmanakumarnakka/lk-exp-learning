import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/docs/Sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14">
        <DocsSidebar />
        <div className="min-w-0 py-10 lg:py-14">{children}</div>
      </div>
    </div>
  );
}
