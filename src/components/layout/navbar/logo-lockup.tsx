import Link from "next/link";
import LogoSquare from "@/components/logo-square";
import { site } from "@/lib/site";

/**
 * Header lockup (DESIGN.md §5): the seal paired with the wordmark, anchored to
 * the left corner. The seal alone read as an orphan mark floating in the rail -
 * setting the name beside it gives the corner something to hold onto and lets
 * the nav take the optical centre instead.
 */
export default function LogoLockup() {
  return (
    <Link
      href="/"
      prefetch
      aria-label={`${site.name} home`}
      className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-70"
    >
      <LogoSquare />
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-display text-[1.35rem] leading-none tracking-[0.01em] text-oxblood">
          {site.wordmark}{" "}
          <span className="text-ink">{site.wordmarkAccent}</span>
        </span>
        <span className="micro-mono mt-1 text-ink/60">
          Est. {site.since} · {site.origin}
        </span>
      </span>
    </Link>
  );
}
