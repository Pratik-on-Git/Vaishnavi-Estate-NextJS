import clsx from "clsx";

/**
 * Cart affordance. Word plus count rather than an icon badge — it matches the
 * "CART (3)" treatment in the reference navigation and reads without decoding.
 */
export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <span
      className={clsx(
        "font-mono text-spec uppercase tracking-micro text-ink transition-colors hover:text-oxblood",
        className
      )}
    >
      Cart ({quantity ?? 0})
    </span>
  );
}
