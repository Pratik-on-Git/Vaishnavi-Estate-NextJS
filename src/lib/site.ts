/**
 * Brand content for Vaishnavi Estate.
 *
 * Every piece of editorial copy on the marketing surfaces lives here rather
 * than being inlined in JSX, so the voice can be revised in one pass without
 * touching layout. Commerce data (products, collections, prices) still comes
 * from Shopify — this file only covers the storytelling around it.
 */

export const site = {
  name: "Vaishnavi Estate",
  wordmark: "VAISHNAVI",
  wordmarkAccent: "ESTATE",
  tagline: "Strong Coffee · Bold · Pure",
  origin: "Coorg, Karnataka",
  since: "1928",
  description:
    "Single-origin, shade-grown Robusta from a four-generation family estate in Coorg. Roasted in small batches, ground to order, shipped across India.",
} as const;

/** Fallback navigation, used when the Shopify menu is empty or unreachable. */
export const primaryNav: { title: string; path: string }[] = [
  { title: "Coffee", path: "/search" },
  { title: "Brew guides", path: "/search/brew-guides" },
  { title: "The estate", path: "/about" },
  { title: "Homestay", path: "/homestay" },
];

/** The hero spec strip — the row of micro-labels under the wordmark in ref 1. */
export const heroSpecs = [
  { label: "Single origin", value: "Coorg Robusta" },
  { label: "Roasted", value: "In small batches" },
  { label: "Ground", value: "Fresh on order" },
  { label: "Shipping", value: "Free across India" },
  { label: "Grown since", value: site.since },
] as const;

/** Full-bleed scrolling ticker beneath the hero. */
export const tickerPhrases = [
  "Shade grown",
  "Four generations deep",
  "Roasted daily",
  "Elegance in every roast",
  "Single origin Coorg",
  "Legacy in every bean",
] as const;

/** Estate numbers, set in the display serif like the reference stat block. */
export const estateStats = [
  { value: site.since, label: "the year the estate was planted" },
  { value: "4", label: "generations of the same family" },
  { value: "100%", label: "shade-grown single-origin Robusta" },
  { value: "48h", label: "from roast to dispatch" },
  { value: "3,500", label: "feet above sea level" },
  { value: "5", label: "brew formats ground to order" },
] as const;

/** Brew-format grid. Handles map to Shopify collections where they exist. */
export const brewFormats = [
  {
    title: "Espresso",
    handle: "espresso",
    note: "Fine grind, dense crema, built for pressure.",
  },
  {
    title: "Filter",
    handle: "filter",
    note: "The South Indian decoction. Medium-fine, unhurried.",
  },
  {
    title: "Moka pot",
    handle: "moka-pot",
    note: "Stovetop intensity without the espresso machine.",
  },
  {
    title: "French press",
    handle: "french-press",
    note: "Coarse and full-bodied. Nothing held back.",
  },
  {
    title: "Aeropress",
    handle: "aeropress",
    note: "Clean, quick, forgiving. Our travel companion.",
  },
  {
    title: "Green beans",
    handle: "green-beans",
    note: "Unroasted, for those who roast their own.",
  },
] as const;

/** The estate story, told in three chapters down the page. */
export const chapters = [
  {
    index: "01",
    title: "We believe coffee",
    titleAccent: "is an art form",
    body: "Four generations have worked this land in Coorg. What began in 1928 as a smallholding under the shade of native rosewood is now an estate that still refuses shortcuts — no sun-drying on tarmac, no blending away a difficult harvest, no beans older than the season.",
  },
  {
    index: "02",
    title: "Grown slowly,",
    titleAccent: "picked by hand",
    body: "Our Robusta grows at three and a half thousand feet under a canopy that keeps the cherries cool and slow to ripen. Every cherry is picked by hand at peak red, pulped the same evening, and sun-dried on raised beds where the airflow can reach it from every side.",
  },
  {
    index: "03",
    title: "Roasted small,",
    titleAccent: "ground on order",
    body: "We roast in batches small enough to taste through, then hold the beans whole until your order arrives. Grinding happens after you buy, matched to the brew method you choose — because the aromatics you paid for start leaving the moment the bean is broken.",
  },
] as const;

/** Homepage FAQ — mirrors the accordion in the reference layout. */
export const faqs = [
  {
    question: "What makes Robusta worth seeking out?",
    answer:
      "Robusta has spent decades as the cheap half of a blend, which says more about how it is usually grown than what it can be. Grown in shade at altitude and processed with care, it gives you a heavier body, a deeper chocolate base and nearly twice the caffeine of Arabica. We grow nothing else.",
  },
  {
    question: "How fresh is the coffee when it reaches me?",
    answer:
      "We roast in small batches through the week and dispatch within forty-eight hours of roasting. Beans are ground only after your order is placed, matched to the brew method you select at checkout.",
  },
  {
    question: "Which roast level should I start with?",
    answer:
      "Medium is the honest introduction to the estate — it carries the cocoa and dried-fruit notes without the smoke. Choose dark if you drink with milk or brew South Indian filter, and light if you want the fruit acidity forward in a pourover.",
  },
  {
    question: "Do you ship outside India?",
    answer:
      "Shipping is free across India on every order. For international orders, write to us and we will quote freight to your country directly.",
  },
  {
    question: "Can I visit the estate?",
    answer:
      "Yes. The homestay is open through the harvest season, and stays include a walk through the plantation, the pulping shed and the roastery. Booking is by request.",
  },
] as const;

export const footerColumns = [
  {
    title: "Shop",
    links: [
      { title: "All coffee", path: "/search" },
      { title: "Ground", path: "/search/ground-coffee" },
      { title: "Whole beans", path: "/search/whole-beans" },
      { title: "Green beans", path: "/search/green-beans" },
      { title: "Gift boxes", path: "/search/gift-boxes" },
    ],
  },
  {
    title: "The estate",
    links: [
      { title: "Our story", path: "/about" },
      { title: "How we roast", path: "/roasting" },
      { title: "Homestay", path: "/homestay" },
      { title: "Brew guides", path: "/search/brew-guides" },
    ],
  },
  {
    title: "Help",
    links: [
      { title: "My account", path: "/account" },
      { title: "Shipping", path: "/shipping-policy" },
      { title: "Returns", path: "/refund-policy" },
      { title: "Contact", path: "/contact" },
    ],
  },
] as const;

export const socialLinks = [
  { title: "Instagram", href: "https://instagram.com" },
  { title: "Facebook", href: "https://facebook.com" },
  { title: "LinkedIn", href: "https://linkedin.com" },
  { title: "Twitter", href: "https://twitter.com" },
] as const;
