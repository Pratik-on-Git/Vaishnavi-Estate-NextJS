import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

/**
 * Dark promo panel (DESIGN.md §5). A near-black photographic tile with the
 * label set in the display serif near the top — the one place in the system
 * where flame type sits on a dark ground rather than white.
 *
 * `src` is optional: without estate photography the tile renders a coal panel
 * rather than a broken image, and the label still reads.
 */
export default function PromoTile({
  title,
  href,
  src,
  alt = "",
  priority,
  className,
}: {
  title: string;
  href: string;
  src?: string | null;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "on-dark group relative block overflow-hidden rounded-plate bg-coal",
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priority}
          className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          aria-hidden
          // Darkest stop matches --coal, so the placeholder blends with the
          // rest of the on-dark surface rather than reading as a mismatched
          // near-black.
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_15%,#5A2A0F_0%,#42200C_45%,#341706_100%)]"
        />
      )}

      {/* Keeps the label legible over a bright frame in the photograph. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/45 to-transparent"
      />

      <div className="relative flex h-full items-start justify-center p-8">
        {/* Amber, not oxblood: oxblood on this ground measures 1.8:1 and
            simply disappears. Amber reads at 9.2:1. */}
        <h3 className="serif text-display-md text-amber">{title}</h3>
      </div>
    </Link>
  );
}
