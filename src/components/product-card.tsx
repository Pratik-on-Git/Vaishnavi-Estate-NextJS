"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { startTransition, useState } from "react";
import Price from "./price";
import { Badge } from "./ui/section";
import { addItem, type CartActionState } from "./cart/actions";
import { useCart } from "./cart/cart-context";
import { MAX_LINE_QUANTITY } from "@/lib/constants";
import type {
  Image as ShopifyImage,
  Money,
  ProductVariant,
} from "@/lib/shopify/types";

/**
 * Product cell (DESIGN.md §5). A packshot on the mist tile with a status badge
 * inset top-left, then a single mono row: title left, price right. Cards carry
 * no border of their own - they sit flush inside the hairline grid, which owns
 * the dividing rules.
 *
 * The card also sells. Rather than sending every shopper to a detail page to
 * add one bag, it carries its own gallery, quantity stepper and add button:
 *
 *   gallery   arrows and dots page the product's own shots in place, so a
 *             shopper can see the back of the pack without leaving the grid
 *   quantity  a stepper, clamped to `MAX_LINE_QUANTITY`
 *   add       adds the chosen quantity of the single sellable variant
 *
 * A product with real choices to make - more than one variant - has no add
 * button here on purpose. Guessing which roast someone meant is worse than
 * asking, so those cards send you to the detail page for the choice.
 *
 * The plate is a `<Link>` overlay rather than the whole card being one, so the
 * controls inside it are real buttons instead of nested interactive elements.
 */

/**
 * What a card renders, and nothing more.
 *
 * Structural rather than `Product`, so the shop grid can build cards from the
 * listing shape it already holds - see `lib/shopify/fragments/product-card.ts`
 * for why the catalogue is read through a smaller fragment than the detail
 * page uses. The full `Product` satisfies this, so every existing caller keeps
 * working untouched.
 */
export type ProductCardProduct = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  tags: string[];
  featuredImage?: ShopifyImage | null;
  images?: ShopifyImage[];
  variants?: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
};

/** Shopify tags drive the flag; the first match wins. */
const BADGE_TAGS: Record<string, string> = {
  new: "New!",
  seasonal: "Seasonal",
  sale: "Sale",
  limited: "Limited",
  bestseller: "Bestseller",
};

function badgeFor(product: ProductCardProduct): string | null {
  for (const tag of product.tags ?? []) {
    const label = BADGE_TAGS[tag.toLowerCase()];
    if (label) return label;
  }
  return null;
}

/**
 * The shots this card can page through, featured one first and deduplicated by
 * URL - Shopify returns the featured image inside `images` as well, and the
 * same photograph twice reads as a broken carousel.
 */
function galleryFor(product: ProductCardProduct): ShopifyImage[] {
  const shots = [
    ...(product.featuredImage ? [product.featuredImage] : []),
    ...(product.images ?? []),
  ];

  const seen = new Set<string>();
  return shots.filter((shot) => {
    if (!shot?.url || seen.has(shot.url)) return false;
    seen.add(shot.url);
    return true;
  });
}

export default function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
}: {
  product: ProductCardProduct;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const { addCartItem, runCartMutation, reportStatus } = useCart();

  const [shot, setShot] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);
  const [result, setResult] = useState<CartActionState>(null);

  const price = product.priceRange.minVariantPrice;
  const isRange = price.amount !== product.priceRange.maxVariantPrice.amount;
  const badge = badgeFor(product);
  const gallery = galleryFor(product);
  const href = `/product/${product.handle}`;

  const variants = product.variants ?? [];
  // One variant means there is nothing to choose, so the card can sell it
  // outright. Anything else belongs on the detail page.
  const sellable = variants.length === 1 ? variants[0] : undefined;
  const canAdd = Boolean(
    product.availableForSale && sellable && sellable.availableForSale
  );

  const step = (by: number) =>
    setQuantity((current) =>
      Math.min(MAX_LINE_QUANTITY, Math.max(1, current + by))
    );

  const page = (event: React.MouseEvent, by: number) => {
    event.preventDefault();
    event.stopPropagation();
    setShot((current) => {
      const length = gallery.length || 1;
      return (((current + by) % length) + length) % length;
    });
  };

  const goTo = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    setShot(index);
  };

  const active = gallery.length
    ? ((shot % gallery.length) + gallery.length) % gallery.length
    : 0;

  function add() {
    if (!sellable || !canAdd || pending) return;

    setResult(null);
    setPending(true);

    startTransition(async () => {
      addCartItem(sellable, product, quantity);

      try {
        const outcome = await runCartMutation(() =>
          addItem(null, { merchandiseId: sellable.id, quantity })
        );
        setResult(outcome);
        reportStatus(outcome);
        if (outcome?.ok !== false) {
          setAdded(true);
          setQuantity(1);
          window.setTimeout(() => setAdded(false), 2000);
        }
      } catch (error) {
        console.error(error);
        const failure = {
          ok: false,
          message: "We couldn't add that to your cart.",
        };
        setResult(failure);
        reportStatus(failure);
      } finally {
        setPending(false);
      }
    });
  }

  const errorMessage = result && !result.ok ? result.message : "";

  return (
    <article
      className={clsx("group flex h-full flex-col p-3 md:p-4", className)}
    >
      <div className="plate aspect-square w-full">
        {gallery.length ? (
          gallery.map((image, index) => (
            <Image
              key={image.url}
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes={sizes}
              // Only the shot on screen is worth the priority hint; the rest
              // are a browse the visitor may never open.
              priority={priority && index === 0}
              loading={priority && index === 0 ? undefined : "lazy"}
              className={clsx(
                "object-contain p-6 transition-all duration-500 ease-editorial group-hover:scale-[1.03]",
                index === active ? "opacity-100" : "opacity-0"
              )}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="eyebrow">No image</span>
          </div>
        )}

        {/* The whole plate navigates, so the card still reads as one target -
            but as an overlay rather than as a wrapper, which would make the
            controls below nested interactive elements. */}
        <Link
          href={href}
          prefetch
          aria-label={product.title}
          className="absolute inset-0 z-10"
        />

        {/* Availability outranks a marketing tag - never flag a sold-out bag
            as "New!". */}
        {!product.availableForSale || badge ? (
          <span className="pointer-events-none absolute left-4 top-4 z-20">
            <Badge>{product.availableForSale ? badge : "Sold out"}</Badge>
          </span>
        ) : null}

        {gallery.length > 1 ? (
          <>
            <div className="pointer-events-none absolute inset-x-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between">
              {[
                { by: -1, label: "Previous image", Icon: ChevronLeftIcon },
                { by: 1, label: "Next image", Icon: ChevronRightIcon },
              ].map(({ by, label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={(event) => page(event, by)}
                  aria-label={`${label} of ${product.title}`}
                  className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-rule bg-paper/90 text-ink backdrop-blur-sm transition-colors hover:bg-oxblood hover:text-paper active:scale-95"
                >
                  <Icon aria-hidden className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5">
              {gallery.map((image, index) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={(event) => goTo(event, index)}
                  aria-label={`Show image ${index + 1} of ${gallery.length}`}
                  aria-current={index === active}
                  className="pointer-events-auto flex h-5 items-center justify-center px-0.5"
                >
                  <span
                    className={clsx(
                      "block h-1.5 rounded-full transition-all duration-300",
                      index === active
                        ? "w-5 bg-oxblood"
                        : "w-1.5 bg-oxblood/35 hover:bg-oxblood/60"
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="ui-mono normal-case">
          <Link href={href} prefetch className="hover:underline">
            {product.title}
          </Link>
        </h3>
        <div className="flex shrink-0 items-baseline gap-1.5">
          {isRange ? <span className="ui-mono normal-case">from</span> : null}
          <Price
            className="ui-mono normal-case"
            amount={price.amount}
            currencyCode={price.currencyCode}
          />
        </div>
      </div>

      {/* Pushed to the bottom so cards with titles of different lengths still
          line their controls up across a row. */}
      <div className="mt-auto pt-3">
        {canAdd ? (
          <form action={add} className="flex items-center gap-2">
            <div className="flex h-10 shrink-0 items-center rounded-full border border-rule px-1">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={quantity <= 1}
                aria-label={`Decrease quantity of ${product.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-wash active:scale-90 disabled:pointer-events-none disabled:opacity-30"
              >
                <MinusIcon aria-hidden className="h-3.5 w-3.5" />
              </button>
              <span
                aria-live="polite"
                className="ui-mono w-6 select-none text-center tabular-nums"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={quantity >= MAX_LINE_QUANTITY}
                aria-label={`Increase quantity of ${product.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-wash active:scale-90 disabled:pointer-events-none disabled:opacity-30"
              >
                <PlusIcon aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={pending}
              aria-label={`Add ${product.title} to cart`}
              aria-busy={pending}
              className={clsx(
                "ui-mono flex h-10 flex-1 items-center justify-center rounded-full border transition-colors",
                added
                  ? "border-amber bg-amber text-ink"
                  : pending
                    ? "cursor-wait border-rule text-oxblood"
                    : "border-oxblood text-oxblood hover:bg-oxblood hover:text-paper"
              )}
            >
              {pending ? "Adding…" : added ? "Added" : "Add"}
            </button>
          </form>
        ) : (
          <Link
            href={href}
            prefetch
            className="ui-mono flex h-10 items-center justify-center rounded-full border border-rule text-oxblood transition-colors hover:border-oxblood"
          >
            {product.availableForSale ? "Choose options" : "Sold out"}
          </Link>
        )}

        {errorMessage ? (
          <p role="alert" className="spec-mono mt-2 text-center">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </article>
  );
}
