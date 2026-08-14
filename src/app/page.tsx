import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import ProductCard from "@/components/product-card";
import Marquee from "@/components/ui/marquee";
import Plate from "@/components/ui/plate";
import Accordion from "@/components/ui/accordion";
import Newsletter from "@/components/ui/newsletter";
import { Eyebrow, Headline, Section, SectionHeader } from "@/components/ui/section";
import {
  brewFormats,
  chapters,
  estateStats,
  faqs,
  heroSpecs,
  site,
  tickerPhrases,
} from "@/lib/site";

export const metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  openGraph: { type: "website" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee phrases={tickerPhrases} tone="oxblood" />
      <Suspense fallback={<FeaturedFallback />}>
        <FeaturedRoasts />
      </Suspense>
      <EstateStory />
      <EstateNumbers />
      <BrewFormats />
      <Roastery />
      <Questions />
      <Visit />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <Section tone="espresso" className="relative">
      <Plate tone="espresso" priority inset />
      {/* Legibility scrim under the wordmark and the spec strip. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-espresso/70 via-espresso/25 to-espresso/85"
      />

      {/* Fill the viewport below the header stack (2.25rem strip + nav). */}
      <div className="relative flex min-h-[calc(100svh-6.25rem)] flex-col justify-between pb-10 pt-16 md:min-h-[calc(100svh-7.25rem)] md:pb-14 md:pt-20">
        <div className="shell">
          <p className="animate-riseIn font-display text-lg italic text-clay">
            {site.origin} · Est. {site.since}
          </p>
          <h1 className="mt-6 animate-riseIn text-wordmark text-display-lg text-paper animation-delay-100">
            <span className="sr-only">{site.name}</span>
            <span aria-hidden className="block">
              {site.wordmark}
            </span>
            <span aria-hidden className="block text-clay">
              {site.wordmarkAccent}
            </span>
          </h1>
        </div>

        {/* Spec strip — the row of micro-labels beneath the reference hero. */}
        <div className="shell mt-12 border-y border-paper/20 py-5">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-5">
            {heroSpecs.map((spec) => (
              <li key={spec.label}>
                <p className="eyebrow-inverse">{spec.label}</p>
                <p className="mt-1.5 font-display text-base text-paper md:text-lg">
                  {spec.value}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="shell mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Headline
            as="p"
            size="sm"
            className="max-w-xl text-paper"
            accent="four generations deep."
          >
            Coffee grown
          </Headline>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/search" className="btn-inverse">
              Shop the harvest
            </Link>
            <Link href="/about" className="link-rule text-paper">
              Read our story
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

async function FeaturedRoasts() {
  // Best sellers drive the shelf; falls back to newest if the store is fresh.
  let products: Product[] = [];
  try {
    products = await getProducts({ sortKey: "BEST_SELLING", reverse: false });
  } catch {
    products = [];
  }
  const shelf = products.slice(0, 8);

  return (
    <Section className="py-20 md:py-28">
      <div className="shell">
        <SectionHeader
          index="01"
          eyebrow="The shelf"
          title="Small batches,"
          accent="roasted this week"
          body="Every lot on this page was picked, pulped and dried on the estate. Choose your grind at checkout and we mill it the day it ships."
          action={
            <Link href="/search" className="link-rule self-start">
              All coffee &rarr;
            </Link>
          }
        />

        {shelf.length ? (
          <ul className="mt-14 grid grid-cols-1 gap-px bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
            {shelf.map((product, index) => (
              <li key={product.handle}>
                <ProductCard product={product} priority={index < 4} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-14 max-w-prose2 text-sm leading-relaxed text-ink-muted">
            The shelf is being restocked. Connect the Shopify storefront to list
            the current harvest here.
          </p>
        )}
      </div>
    </Section>
  );
}

function FeaturedFallback() {
  return (
    <Section className="py-20 md:py-28">
      <div className="shell">
        <div className="h-10 w-64 animate-pulse bg-ink/10" />
        <ul className="mt-14 grid grid-cols-1 gap-px bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="bg-paper">
              <div className="aspect-[4/5] w-full animate-pulse bg-paper-100" />
              <div className="border-t border-ink/12 p-5">
                <div className="h-5 w-3/4 animate-pulse bg-ink/10" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function EstateStory() {
  const [chapter] = chapters;

  return (
    <Section className="border-t border-ink/15 py-20 md:py-28">
      <div className="shell grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Eyebrow index={chapter.index}>The estate</Eyebrow>
          <Headline className="mt-6" accent={chapter.titleAccent}>
            {chapter.title}
          </Headline>
          <p className="mt-8 max-w-prose2 text-sm leading-relaxed text-ink-muted">
            {chapter.body}
          </p>
          <Link href="/about" className="link-rule mt-10 inline-block">
            More about the estate &rarr;
          </Link>
        </div>

        {/* Offset image pair, as in the reference's history spread. */}
        <div className="grid grid-cols-5 gap-4 md:col-span-6 md:col-start-7 md:gap-6">
          <Plate tone="clay" className="col-span-3 aspect-[3/4]" sizes="40vw" />
          <Plate
            tone="espresso"
            className="col-span-2 mt-16 aspect-[3/4]"
            sizes="25vw"
          />
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function EstateNumbers() {
  return (
    <Section tone="oxblood" className="py-20 md:py-28">
      <div className="shell">
        <Eyebrow inverse>By the numbers</Eyebrow>
        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {estateStats.map((stat) => (
            <div key={stat.label} className="border-t border-paper/25 pt-5">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-4xl leading-none md:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-3 block text-xs leading-relaxed text-paper/70">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function BrewFormats() {
  const [, chapter] = chapters;

  return (
    <Section className="py-20 md:py-28">
      <div className="shell">
        <SectionHeader
          index={chapter.index}
          eyebrow="Ground to order"
          title={chapter.title}
          accent={chapter.titleAccent}
          body={chapter.body}
        />

        <ul className="mt-14 grid grid-cols-1 gap-px bg-ink/12 sm:grid-cols-2 lg:grid-cols-3">
          {brewFormats.map((format, index) => (
            <li key={format.handle} className="bg-paper">
              <Link
                href={`/search/${format.handle}`}
                className="group flex h-full flex-col justify-between gap-10 p-7 transition-colors duration-300 ease-editorial hover:bg-paper-100 md:p-9"
              >
                <p className="eyebrow">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-3xl transition-colors group-hover:text-oxblood">
                    {format.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
                    {format.note}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function Roastery() {
  const chapter = chapters[2];

  return (
    <Section tone="espresso" className="py-20 md:py-28">
      <div className="shell grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-6">
          <Plate tone="espresso" className="aspect-[4/3] w-full" sizes="50vw" />
        </div>
        <div className="flex flex-col justify-center md:col-span-5 md:col-start-8">
          <Eyebrow index={chapter.index} inverse>
            The roastery
          </Eyebrow>
          <Headline className="mt-6 text-paper" accent={chapter.titleAccent}>
            {chapter.title}
          </Headline>
          <p className="mt-8 max-w-prose2 text-sm leading-relaxed text-paper/70">
            {chapter.body}
          </p>
          <blockquote className="mt-10 border-l border-clay pl-6">
            <p className="font-display text-xl italic leading-snug text-paper">
              &ldquo;You cannot roast your way out of a bad harvest. Everything
              worth tasting was decided on the hill.&rdquo;
            </p>
            <footer className="eyebrow-inverse mt-4">
              The fourth generation, {site.origin}
            </footer>
          </blockquote>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function Questions() {
  return (
    <Section className="py-20 md:py-28">
      <div className="shell grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <Eyebrow index="04">Questions</Eyebrow>
          <Headline className="mt-6" accent="to your questions">
            Find answers
          </Headline>
          <p className="mt-8 max-w-prose2 text-sm leading-relaxed text-ink-muted">
            Still unsure? Write to us and someone who has actually walked the
            rows will reply.
          </p>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <Accordion items={faqs} />
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function Visit() {
  return (
    <Section tone="oxblood" className="py-20 md:py-28">
      <div className="shell grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-6">
          <Eyebrow index="05" inverse>
            Stay with us
          </Eyebrow>
          <Headline className="mt-6" accent="where it is grown">
            Taste the coffee
          </Headline>
          <p className="mt-8 max-w-prose2 text-sm leading-relaxed text-paper/70">
            The homestay opens through harvest. Walk the plantation at first
            light, watch the pulping shed run, and cup the day&apos;s roast
            straight off the drum.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/homestay" className="btn-inverse">
              Request a stay
            </Link>
            <Link href="/search" className="link-rule text-paper">
              Shop coffee instead
            </Link>
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <p className="eyebrow-inverse">Letters from the estate</p>
          <p className="mt-5 max-w-prose2 font-display text-2xl leading-snug">
            Harvest notes and roast releases, a few times a year.
          </p>
          <div className="mt-8">
            <Newsletter inverse />
          </div>
        </div>
      </div>
    </Section>
  );
}
