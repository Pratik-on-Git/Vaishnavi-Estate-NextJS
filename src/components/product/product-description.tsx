import { Product } from "@/lib/shopify/types";
import Price from "../price";
import VariantSelector from "./variant-selector";
import Prose from "../prose";
import { AddToCart } from "../cart/add-to-cart";
import Accordion from "../ui/accordion";
import { site } from "@/lib/site";

/**
 * Buy panel. Order follows how the decision is actually made: what it is, what
 * it costs, which grind, then the commitment — with the long-form detail
 * folded away underneath so it never pushes the button below the fold.
 */
export function ProductDescription({ product }: { product: Product }) {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const isRange = minVariantPrice.amount !== maxVariantPrice.amount;
  const kicker = product.tags?.find((tag) => !tag.startsWith("nextjs-"));

  return (
    <div>
      {kicker ? <p className="eyebrow">{kicker}</p> : null}

      <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">
        {product.title}
      </h1>

      <div className="mt-6 flex items-baseline gap-3 border-b border-ink/15 pb-6">
        {isRange ? (
          <span className="font-mono text-spec uppercase tracking-micro text-ink-muted">
            From
          </span>
        ) : null}
        <Price
          className="font-display text-3xl text-oxblood"
          amount={minVariantPrice.amount}
          currencyCode={minVariantPrice.currencyCode}
        />
        <span
          className={`ml-auto font-mono text-spec uppercase tracking-micro ${
            product.availableForSale ? "text-ink-muted" : "text-oxblood"
          }`}
        >
          {product.availableForSale ? "In stock" : "Sold out"}
        </span>
      </div>

      <div className="mt-8">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>

      <div className="mt-8">
        <AddToCart product={product} />
      </div>

      {/* Standing promises, repeated at the point of decision. */}
      <ul className="mt-6 grid grid-cols-3 gap-4 border-y border-ink/15 py-5">
        {[
          { label: "Shipping", value: "Free in India" },
          { label: "Roasted", value: "Small batch" },
          { label: "Ground", value: "On order" },
        ].map((item) => (
          <li key={item.label}>
            <p className="eyebrow">{item.label}</p>
            <p className="mt-1.5 font-display text-base">{item.value}</p>
          </li>
        ))}
      </ul>

      {product.descriptionHtml ? (
        <Prose
          className="mt-10 text-sm leading-relaxed"
          html={product.descriptionHtml}
        />
      ) : null}

      <div className="mt-10">
        <Accordion
          items={[
            {
              question: "Origin",
              answer: `Single-origin shade-grown Robusta from our estate in ${site.origin}, planted in ${site.since}. Hand-picked at peak ripeness and dried on raised beds.`,
            },
            {
              question: "Shipping & returns",
              answer:
                "Free shipping across India, dispatched within 48 hours of roasting. If a bag arrives damaged or stale, write to us and we will replace it.",
            },
          ]}
        />
      </div>
    </div>
  );
}
