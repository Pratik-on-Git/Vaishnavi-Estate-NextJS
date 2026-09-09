"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef } from "react";

export type BrowseRailItem = {
  title: string;
  href: string;
  count: number;
  active: boolean;
};

/**
 * The category rail in the sticky shop bar.
 *
 * Every collection carrying stock, as compact pills with their live counts.
 * The selected one is scrolled into the middle of the rail on navigation, so
 * a shopper five collections deep can still see where they are and what sits
 * either side of it.
 */
export default function BrowseRail({ items }: { items: BrowseRailItem[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [items]);

  // A trackpad's vertical flick is the natural gesture over a horizontal rail,
  // and the browser will not translate it on its own.
  const handleWheel = (event: React.WheelEvent<HTMLUListElement>) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && railRef.current) {
      railRef.current.scrollLeft += event.deltaY;
    }
  };

  if (!items.length) return null;

  return (
    <nav
      aria-label="Browse categories"
      className="relative w-full min-w-0 flex-1 overflow-hidden"
    >
      <ul
        ref={railRef}
        data-lenis-prevent
        data-lenis-prevent-horizontal
        onWheel={handleWheel}
        className="rail items-center gap-2 scroll-smooth px-0.5 py-1"
      >
        {items.map((item) => (
          <li
            key={item.href}
            ref={item.active ? activeItemRef : undefined}
            className="shrink-0"
          >
            <Link
              href={item.href}
              scroll={false}
              prefetch={false}
              aria-current={item.active ? "page" : undefined}
              className={clsx(
                "ui-mono inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors duration-150",
                item.active
                  ? "border-ink bg-ink font-bold text-paper"
                  : "border-rule text-oxblood hover:border-oxblood hover:text-ink"
              )}
            >
              <span className="truncate">{item.title}</span>
              <span
                className={clsx(
                  "spec-mono tabular-nums",
                  item.active ? "text-paper/75" : "text-oxblood/65"
                )}
              >
                {item.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
