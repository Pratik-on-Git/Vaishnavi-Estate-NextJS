import clsx from "clsx";
import Price from "./price";

/**
 * Caption bar laid over an image tile. A flat espresso band rather than a
 * floating pill — it reads as a printed caption strip, matching the
 * micro-label treatment used across the hero and section grids.
 */
export default function Label({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) {
  return (
    <div
      className={clsx("absolute inset-x-0 bottom-0 flex", {
        "lg:bottom-[35%]": position === "center",
      })}
    >
      <div className="flex w-full items-center justify-between gap-4 bg-espresso/90 px-4 py-3 text-paper backdrop-blur-sm">
        <h3 className="line-clamp-2 font-display text-base leading-tight">
          {title}
        </h3>
        <Price
          className="shrink-0 font-mono text-spec tracking-micro text-clay"
          amount={amount}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  );
}
