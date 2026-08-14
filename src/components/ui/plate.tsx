import Image from "next/image";
import clsx from "clsx";

/**
 * Editorial image slot.
 *
 * The repo ships no estate photography yet (the remaining files in `public/`
 * are apparel placeholders from the starter), so this renders a warm,
 * roast-toned panel in the brand palette instead of a broken or off-brand
 * image. Pass `src` — a Shopify CDN URL or a local asset — and it renders the
 * real photograph instead, with no other change needed at the call site.
 */
export default function Plate({
  src,
  alt = "",
  tone = "espresso",
  priority,
  sizes = "100vw",
  /** Stretch to fill the nearest positioned ancestor instead of flowing. */
  inset = false,
  className,
  children,
}: {
  src?: string | null;
  alt?: string;
  tone?: "espresso" | "oxblood" | "clay";
  priority?: boolean;
  sizes?: string;
  inset?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "overflow-hidden bg-espresso",
        inset ? "absolute inset-0 h-full w-full" : "relative",
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden
          className={clsx("absolute inset-0", {
            "bg-[radial-gradient(120%_90%_at_20%_10%,#5A3220_0%,#2A1813_45%,#140C0A_100%)]":
              tone === "espresso",
            "bg-[radial-gradient(120%_90%_at_75%_15%,#9C2233_0%,#54101C_50%,#3A0B13_100%)]":
              tone === "oxblood",
            "bg-[radial-gradient(120%_90%_at_30%_20%,#D6A469_0%,#A06E39_45%,#3A241C_100%)]":
              tone === "clay",
          })}
        >
          {/* Soft candlelight pooling, echoing the reference interiors. */}
          <div className="absolute inset-0 bg-[radial-gradient(45%_35%_at_70%_75%,rgba(214,164,105,0.28)_0%,transparent_70%)]" />
        </div>
      )}
      {children}
    </div>
  );
}
