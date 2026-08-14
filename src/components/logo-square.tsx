import clsx from "clsx";
import LogoIcon from "./icons/logo";
import { site } from "@/lib/site";

/**
 * Wordmark lockup: estate monogram beside the name set in the display serif.
 * `compact` drops the wordmark to just the monogram for tight rails.
 */
export default function LogoSquare({
  size,
  compact = false,
  className,
}: {
  size?: "sm" | undefined;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={clsx("flex items-center gap-3", className)}>
      <LogoIcon
        className={clsx("shrink-0", {
          "h-7 w-7": !size,
          "h-5 w-5": size === "sm",
        })}
      />
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span
            className={clsx("font-display tracking-tight", {
              "text-lg": !size,
              "text-base": size === "sm",
            })}
          >
            {site.name}
          </span>
          <span className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-wider2 opacity-60">
            {site.origin} · Est. {site.since}
          </span>
        </span>
      ) : null}
    </span>
  );
}
