import Collections from "@/components/layout/search/collections";
import FilterList from "@/components/layout/search/filter";
import { sorting } from "@/lib/constants";
import { Eyebrow, Headline } from "@/components/ui/section";
import { site } from "@/lib/site";
import { Suspense } from "react";

/**
 * Shop chrome for every browse surface. A masthead, then a sticky rail that
 * carries collections on the left and sort on the right — horizontal rather
 * than the starter's narrow side columns, so the grid gets the full measure.
 */
export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-ink/15 bg-paper">
        <div className="shell py-14 md:py-20">
          <Eyebrow>The shop</Eyebrow>
          <Headline className="mt-5" accent="from a single estate">
            Every bag
          </Headline>
          <p className="mt-6 max-w-prose2 text-sm leading-relaxed text-ink-muted">
            {site.description}
          </p>
        </div>
      </div>

      <div className="sticky top-[6.25rem] z-40 border-b border-ink/15 bg-paper/95 backdrop-blur-md">
        <div className="shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Suspense fallback={<div className="h-6 w-64 animate-pulse bg-ink/10" />}>
            <Collections />
          </Suspense>
          <Suspense fallback={null}>
            <FilterList list={sorting} title="Sort" />
          </Suspense>
        </div>
      </div>

      <div className="shell py-12 md:py-16">{children}</div>
    </>
  );
}
