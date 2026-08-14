import Gallery from "@/components/product/gallery";
import { ProductProvider } from "@/components/product/product-context";
import { ProductDescription } from "@/components/product/product-description";
import ProductCard from "@/components/product-card";
import Marquee from "@/components/ui/marquee";
import { Eyebrow, Headline } from "@/components/ui/section";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import { Image } from "@/lib/shopify/types";
import { site, tickerPhrases } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: { index: indexable, follow: indexable },
    },
    openGraph: url
      ? { images: [{ url, width, height, alt }] }
      : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
    },
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb rail */}
      <div className="border-b border-ink/15">
        <div className="shell flex items-center gap-3 py-4">
          <Link href="/" className="eyebrow hover:text-oxblood">
            Home
          </Link>
          <span aria-hidden className="text-ink-faint">
            /
          </span>
          <Link href="/search" className="eyebrow hover:text-oxblood">
            Coffee
          </Link>
          <span aria-hidden className="text-ink-faint">
            /
          </span>
          <span className="eyebrow text-ink">{product.title}</span>
        </div>
      </div>

      <div className="shell grid gap-12 py-12 md:grid-cols-12 md:gap-12 md:py-16">
        <div className="md:col-span-7">
          <Suspense
            fallback={
              <div className="aspect-square w-full animate-pulse bg-paper-100" />
            }
          >
            <Gallery
              images={product.images.slice(0, 6).map((image: Image) => ({
                src: image.url,
                altText: image.altText,
              }))}
            />
          </Suspense>
        </div>

        <div className="md:col-span-5">
          {/* Sticky so the buy panel stays reachable past a tall gallery. */}
          <div className="md:sticky md:top-32">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
      </div>

      <Marquee phrases={tickerPhrases} tone="espresso" />

      <Suspense fallback={null}>
        <RelatedProducts id={product.id} />
      </Suspense>
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);
  if (!relatedProducts?.length) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="shell">
        <Eyebrow>Also from the estate</Eyebrow>
        <Headline className="mt-5" accent="you may also like">
          Others
        </Headline>
        <ul className="mt-12 grid grid-cols-1 gap-px bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.slice(0, 4).map((product) => (
            <li key={product.handle}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
