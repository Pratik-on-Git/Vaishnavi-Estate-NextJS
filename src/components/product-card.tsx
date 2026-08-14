import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import Price from "./price";
import { Product } from "@/lib/shopify/types";

/**
 * Product card in the reference's grid language: a hairline-bounded cell, a
 * tall image on warm paper, and metadata set below the image rather than
 * floated on top of it — name in the serif, price in the mono.
 */
export default function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  className,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const price = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const isRange = price.amount !== maxPrice.amount;
  // Shopify tags double as the card's kicker (roast level, format, etc.).
  const kicker = product.tags?.find((tag) => !tag.startsWith("nextjs-"));

  return (
    <Link
      href={`/product/${product.handle}`}
      prefetch
      className={clsx(
        "group flex h-full flex-col border border-ink/12 bg-paper transition-colors duration-300 ease-editorial hover:border-ink/35",
        className
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-100">
        {product.featuredImage?.url ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="eyebrow">No image</span>
          </div>
        )}
        {!product.availableForSale ? (
          <span className="absolute left-4 top-4 bg-espresso px-3 py-1.5 font-mono text-micro uppercase tracking-micro text-paper">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 border-t border-ink/12 p-5">
        {kicker ? <p className="eyebrow mb-1">{kicker}</p> : null}
        <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-oxblood">
          {product.title}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-4">
          {isRange ? (
            <span className="font-mono text-spec uppercase tracking-micro text-ink-muted">
              From
            </span>
          ) : null}
          <Price
            className="font-mono text-spec tracking-micro text-ink"
            amount={price.amount}
            currencyCode={price.currencyCode}
          />
        </div>
      </div>
    </Link>
  );
}
