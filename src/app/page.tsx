import Link from "next/link";
import { Suspense } from "react";
import { getCollectionProducts, getProducts } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import ProductCard from "@/components/product-card";
import Price from "@/components/price";
import Marquee from "@/components/ui/marquee";
import Carousel from "@/components/ui/carousel";
import HeroVideo from "@/components/ui/hero-video";
import PromoTile from "@/components/ui/promo-tile";
import ProductTable from "@/components/ui/product-table";
import { Eyebrow, Headline, SectionHead } from "@/components/ui/section";
import {
  aboutCards,
  aboutStatement,
  collectionPills,
  featureBand,
  guidesFeature,
  journalPosts,
  promoTiles,
  site,
} from "@/lib/site";
import Image from "next/image";

export const metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  openGraph: { type: "website" },
};

/**
 * Homepage. Section order follows DESIGN.md: hero → filters → bestsellers →
 * promo pair → blends → about → the single-origin table → brew of the month →
 * merch → guides → journal.
 *
 * Every product-backed section resolves its own data and degrades to nothing
 * when the store has no matching products, so a fresh or partially configured
 * Shopify store still renders a coherent page rather than empty scaffolding.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CollectionFilters />

      <Suspense fallback={<RailFallback />}>
        <Bestsellers />
      </Suspense>

      <PromoPair />

      <Suspense fallback={null}>
        <LatestBlends />
      </Suspense>

      <About />

      <Suspense fallback={null}>
        <SingleOrigin />
      </Suspense>

      <Suspense fallback={null}>
        <BrewOfTheMonth />
      </Suspense>

      <Suspense fallback={null}>
        <Merch />
      </Suspense>

      <Guides />
      <Journal />
    </>
  );
}

/* ----------------------------------------------------------------- helpers */

/** Collection first, all products as the fallback for an unconfigured store. */
async function productsFrom(
  collection: string,
  fallbackSort?: { sortKey: string; reverse?: boolean }
): Promise<Product[]> {
  try {
    const fromCollection = await getCollectionProducts({ collection });
    if (fromCollection.length) return fromCollection;
  } catch {
    // Collection does not exist on this store — fall through.
  }

  try {
    return await getProducts(fallbackSort ?? {});
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="shell pt-3">
      {/* `bg-coal` overrides the plate's light tint: the amber statement sits
          on this panel before the video paints, and amber needs a dark ground. */}
      <div className="plate relative aspect-[4/5] w-full overflow-hidden bg-coal sm:aspect-[16/10] lg:aspect-[16/8]">
        {/* Leading slash matters — a bare "Coffee.mp4" resolves against the
            current route, so it would 404 on any page but "/". */}
        <HeroVideo src="/Coffee.mp4" />
        {/* Scrim first: the statement has to hold over whatever the
            footage is doing behind it. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-coal/70 to-transparent"
        />
        {/* The statement rides across the lower third of the frame, in amber —
            the palette's on-dark accent. */}
        <div className="absolute inset-x-0 bottom-[8%]">
          <Marquee
            phrases={Array.from({ length: 4 }, () => site.statement)}
            size="hero"
            separator=""
            duration={38}
            className="text-amber"
          />
        </div>
      </div>
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>
    </section>
  );
}

/* --------------------------------------------------------------- filters */

function CollectionFilters() {
  return (
    <section aria-label="Browse collections" className="rule-b py-10 md:py-12">
      <ul className="shell mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3">
        {collectionPills.map((pill) => (
          <li key={pill.title}>
            <Link
              href={pill.handle ? `/search/${pill.handle}` : "/search"}
              prefetch={false}
              className="pill hover:bg-oxblood hover:text-paper"
            >
              {pill.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --------------------------------------------------------------- rails */

async function Bestsellers() {
  const products = (
    await productsFrom("popular", { sortKey: "BEST_SELLING" })
  ).slice(0, 12);

  if (!products.length) return null;

  return (
    <section aria-labelledby="bestsellers">
      <SectionHead
        eyebrow="Bestsellers"
        title={<span id="bestsellers">Hot off the Roaster</span>}
        count={products.length}
        action="View all"
        actionHref="/search"
      />
      <Carousel label="Bestselling coffee">
        {products.map((product, index) => (
          <ProductCard
            key={product.handle}
            product={product}
            priority={index < 3}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
          />
        ))}
      </Carousel>
    </section>
  );
}

function RailFallback() {
  return (
    <div className="py-16">
      <div className="shell mx-auto h-10 w-64 animate-pulse rounded-full bg-wash" />
      <div className="rule-y mt-12 grid grid-cols-1 divide-x divide-rule sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4">
            <div className="plate aspect-square w-full animate-pulse" />
            <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-wash" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- promo */

function PromoPair() {
  return (
    <section
      aria-label="Shop by brew method"
      className="rule-b grid grid-cols-1 gap-3 px-[var(--gutter)] py-3 md:grid-cols-2"
    >
      {promoTiles.map((tile) => (
        <PromoTile
          key={tile.handle}
          title={tile.title}
          href={`/search/${tile.handle}`}
          className="aspect-[4/3] md:aspect-square"
        />
      ))}
    </section>
  );
}

async function LatestBlends() {
  const products = (await productsFrom("blend", { sortKey: "CREATED_AT", reverse: true })).slice(
    0,
    9
  );

  if (!products.length) return null;

  return (
    <section aria-labelledby="blends">
      <SectionHead
        eyebrow="Latest blends"
        title={<span id="blends">Let&apos;s Mix Things Up</span>}
        count={products.length}
        action="View all"
        actionHref="/search"
      />
      <ul className="rule-y grid grid-cols-1 divide-y divide-rule sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
        {products.slice(0, 3).map((product) => (
          <li key={product.handle}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------------------------------------------------------- about */

function About() {
  return (
    <section aria-labelledby="about" className="rule-b">
      <div className="shell py-12 text-center md:py-16">
        <Eyebrow>About us</Eyebrow>
        <Headline
          id="about"
          size="lg"
          className="mx-auto mt-5 max-w-5xl text-pretty"
        >
          {aboutStatement}
        </Headline>
      </div>

      <Carousel label="About the estate" perView={2}>
        {aboutCards.flatMap((copy, index) => [
          <div key={`copy-${index}`} className="h-full p-6">
            <p className="body-mono">{copy}</p>
          </div>,
          <div key={`image-${index}`} className="h-full p-3">
            <div className="plate aspect-[4/3] w-full">
              <Image
                src={index % 2 === 0 ? "/mens-collection.png" : "/kids-collection.png"}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 85vw"
                className="object-cover"
              />
            </div>
          </div>,
        ])}
      </Carousel>
    </section>
  );
}

/* --------------------------------------------------------- single origin */

async function SingleOrigin() {
  const products = (
    await productsFrom("single-origin", { sortKey: "RELEVANCE" })
  ).slice(0, 16);

  if (!products.length) return null;

  return (
    <section aria-labelledby="single-origin">
      <SectionHead
        eyebrow="Single origin"
        title={<span id="single-origin">Straight from the Source</span>}
        count={products.length}
      />
      <ProductTable products={products} />
    </section>
  );
}

/* ------------------------------------------------------ brew of the month */

async function BrewOfTheMonth() {
  let product: Product | undefined;
  try {
    const [first] = await getProducts({ sortKey: "BEST_SELLING" });
    product = first;
  } catch {
    return null;
  }

  if (!product) return null;

  const price = product.priceRange.minVariantPrice;
  const band = Array.from({ length: 8 }, () => featureBand.label);

  return (
    <section aria-labelledby="feature" className="rule-t">
      <div className="rule-b py-2">
        <Marquee phrases={band} size="display" separator="↓↓↓↓" duration={45} className="text-oxblood" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-3">
          <div className="plate aspect-square w-full">
            {product.featuredImage?.url ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-10"
              />
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-center border-rule p-6 lg:border-l lg:p-10">
          <Eyebrow align="left">{featureBand.eyebrow}</Eyebrow>
          <Headline id="feature" className="mt-4">
            {product.title}
          </Headline>
          <p className="ui-mono mt-4">
            <Price amount={price.amount} currencyCode={price.currencyCode} />
          </p>
          {product.description ? (
            <p className="body-mono mt-6 max-w-measure">
              {product.description.slice(0, 260)}
              {product.description.length > 260 ? "…" : ""}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/product/${product.handle}`}
              className="btn-outline"
            >
              View the roast <span aria-hidden>&rarr;</span>
            </Link>
            <Link href="/search" className="link-arrow self-center">
              All coffee <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="rule-y py-2">
        <Marquee
          phrases={band}
          size="display"
          separator="↑↑↑↑"
          duration={45}
          reverse
          className="text-oxblood"
        />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- merch */

async function Merch() {
  const products = (await productsFrom("merch")).slice(0, 3);
  if (!products.length) return null;

  return (
    <section aria-labelledby="merch">
      <SectionHead
        eyebrow="Merch"
        title={<span id="merch">Fits for Drips</span>}
        count={products.length}
      />
      <ul className="rule-y grid grid-cols-1 divide-y divide-rule sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.handle}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --------------------------------------------------------------- guides */

function Guides() {
  return (
    <section
      aria-labelledby="guides"
      className="rule-b grid grid-cols-1 items-center lg:grid-cols-2"
    >
      <div className="p-6 text-center lg:p-16">
        <Eyebrow>{guidesFeature.eyebrow}</Eyebrow>
        <Headline id="guides" className="mt-4">
          {guidesFeature.title}
        </Headline>
        <p className="body-mono mx-auto mt-5 max-w-measure text-balance">
          {guidesFeature.body}
        </p>
        <Link href={guidesFeature.href} className="btn-outline mt-8">
          {guidesFeature.cta} <span aria-hidden>&rarr;</span>
        </Link>
      </div>
      <div className="p-3">
        <div className="plate aspect-[4/3] w-full">
          <Image
            src="/womens-collection.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- journal */

function Journal() {
  return (
    <section aria-labelledby="journal">
      <SectionHead
        eyebrow="Dispatch"
        title={<span id="journal">From the Journal</span>}
        action="More news"
        actionHref="/journal"
      />
      <ul className="rule-y grid grid-cols-1 divide-y divide-rule md:grid-cols-3 md:divide-x md:divide-y-0">
        {journalPosts.map((post, index) => (
          <li key={post.slug} className="p-3">
            <article>
              <div className="plate aspect-[4/3] w-full">
                <Image
                  src={
                    ["/sales-collection.png", "/mens-collection.png", "/kids-collection.png"][index] ??
                    "/banner.png"
                  }
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="serif mt-4 text-display-sm">{post.title}</h3>
              <p className="body-mono mt-3">{post.excerpt}</p>
              <Link href="/journal" className="link-arrow mt-4">
                Read more <span aria-hidden>&rarr;</span>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
