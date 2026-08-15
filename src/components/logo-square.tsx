import clsx from "clsx";
import LogoIcon from "./icons/logo";
import { site } from "@/lib/site";

/**
 * Centred mark over a mono wordmark — the header lockup for this system. The
 * estate monogram stays as the brand's own identity; only its setting follows
 * the flame design language.
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
    <span className={clsx("flex flex-col items-center leading-none", className)}>
      <LogoIcon
        className={clsx("shrink-0", size === "sm" ? "h-6 w-6" : "h-8 w-8")}
      />
      {!compact ? (
        <span
          className={clsx(
            "micro-mono mt-1 whitespace-nowrap",
            size === "sm" && "text-[0.5625rem]"
          )}
        >
          {site.name}
        </span>
      ) : null}
    </span>
  );
}
