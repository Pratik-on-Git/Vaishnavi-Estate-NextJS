import clsx from "clsx";

/**
 * Full-bleed scrolling ticker, as in the "With Urban Flair · Chic Coffee Vibes"
 * band of the reference. The phrase list is rendered twice so the -50%
 * translation in `.marquee-track` loops without a visible seam; the duplicate
 * is hidden from assistive tech.
 */
export default function Marquee({
  phrases,
  tone = "oxblood",
  className,
}: {
  phrases: readonly string[];
  tone?: "oxblood" | "espresso" | "paper";
  className?: string;
}) {
  const run = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {phrases.map((phrase, i) => (
        <span key={`${phrase}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-xl italic md:px-10 md:text-2xl">
            {phrase}
          </span>
          <span aria-hidden className="text-[0.5rem] opacity-50">
            &#9679;
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={clsx(
        "overflow-hidden border-y py-4",
        {
          "border-paper/20 bg-oxblood text-paper": tone === "oxblood",
          "border-paper/15 bg-espresso text-paper": tone === "espresso",
          "border-ink/15 bg-paper text-ink": tone === "paper",
        },
        className
      )}
    >
      <div className="marquee-track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
