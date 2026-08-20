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
  /** The single line set in the giant footer wordmark. */
  statement: "Elegance in Every Roast. Coffee Grown Four Generations in Coorg.",
  origin: "Coorg, Karnataka",
  since: "1928",
  description:
    "Single-origin, shade-grown Robusta from a four-generation family estate in Coorg. Roasted in small batches, ground to order, shipped across India.",
  freeShippingThreshold: "₹1,500",
} as const;

/**
 * Rotating hero-marquee statements. Kept as short, distinct lines rather than
 * one long sentence — at hero scale a single run-on phrase reads as a blur by
 * the time it's midway across the frame, where three short ones each get a
 * moment to actually be read.
 */
export const heroPhrases = [
  "Legacy in Every Sip.",
  "Elegance in Every Roast.",
  "Coffee Grown Four Generations in Coorg.",
] as const;

/** Fallback navigation, used when the Shopify menu is empty or unreachable. */
export const primaryNav: { title: string; path: string }[] = [
  { title: "Shop", path: "/search" },
  { title: "Journal", path: "/blogs" },
  { title: "About", path: "/about" },
];

/** Scrolling announcement above the header. */
export const announcement = `Spend ${site.freeShippingThreshold} to get free shipping`;

/**
 * Collection pills under the hero. Handles map to Shopify collections; the
 * grid degrades gracefully when a handle does not exist yet.
 */
export const collectionPills = [
  { title: "All coffee", handle: "", previewVideo: "/Coffee.mp4" },
  {
    title: "Popular",
    handle: "popular",
    previewVideo: "/209419_small.mp4",
  },
  {
    title: "Single Origin",
    handle: "single-origin",
    previewVideo:
      "/vecteezy_slow-motion-of-raw-coffee-beans-fall-to-the-ground_1620174.mp4",
  },
  {
    title: "Blend",
    handle: "blend",
    previewVideo: "/45358-443057031.mp4",
  },
  { title: "Filter", handle: "filter", previewVideo: "/209419_small.mp4" },
  { title: "Espresso", handle: "espresso", previewVideo: "/Coffee.mp4" },
  {
    title: "Robusta",
    handle: "robusta",
    previewVideo:
      "/vecteezy_slow-motion-of-raw-coffee-beans-fall-to-the-ground_1620174.mp4",
  },
  {
    title: "Arabica",
    handle: "arabica",
    previewVideo: "/45358-443057031.mp4",
  },
  {
    title: "Coorg",
    handle: "coorg",
    previewVideo: "/209419_small.mp4",
  },
  {
    title: "Dark Roast",
    handle: "dark-roast",
    previewVideo:
      "/vecteezy_slow-motion-of-raw-coffee-beans-fall-to-the-ground_1620174.mp4",
  },
  {
    title: "Washed",
    handle: "washed",
    previewVideo: "/45358-443057031.mp4",
  },
  { title: "Natural", handle: "natural", previewVideo: "/Coffee.mp4" },
] as const;

/** The paired dark promo panels between the product rails. */
export const promoTiles = [
  {
    title: "Shop Filter",
    handle: "filter",
    image: null,
    labelPosition: "top",
  },
  {
    title: "Shop Espresso",
    handle: "espresso",
    image: "/2(4).jpg",
    labelPosition: "bottom",
  },
] as const;

/** Centred statement set in the display serif above the about rail. */
export const aboutStatement =
  "Vaishnavi Estate started with a simple idea: great mornings begin with great coffee. We believe coffee should be fresh, honest, and something you actually look forward to drinking — every single day.";

/** Alternating text cells in the about carousel. */
export const aboutCards = [
  "Our coffee is grown on our own land in Coorg, under a canopy of native shade trees. We pay our pickers above the district rate and have worked with the same families for three generations.",
  "Quality is checked at every stage, from cherry selection to final roast. Each batch is profiled, cupped and evaluated to ensure consistency, balance and exceptional flavour in every roast.",
  "Every cherry is picked by hand at peak ripeness, pulped the same evening, and dried on raised beds where air reaches it from every side. Nothing touches tarmac.",
] as const;

/** Guides teaser — image right, copy left. */
export const guidesFeature = {
  eyebrow: "Guides",
  title: "Pouring the perfect cup",
  body: "Every brew method has its own feel, and part of the fun is figuring out what works for you. Start with these guides, make small adjustments, and follow your taste from there.",
  cta: "Read now",
  href: "/blogs",
} as const;

/** Brew-of-the-month band copy. */
export const featureBand = {
  label: "Brew of the Month",
  eyebrow: "This month",
} as const;

/**
 * Fallback journal entries. The homepage and `/blogs` read real articles from
 * the Shopify Storefront API; these only render when the store has no blog
 * configured yet, so the section never collapses to empty scaffolding.
 */
export const journalPosts = [
  {
    slug: "how-to-store-coffee-beans",
    title: "How to Store Coffee Beans So They Stay Fresh Longer",
    excerpt:
      "Coffee tastes best when it's fresh. Even the highest-quality beans lose their flavour over time if they're stored incorrectly. The good news? Keeping...",
  },
  {
    slug: "morning-coffee-routine",
    title: "Morning Coffee: Make It Part of Your Routine",
    excerpt:
      "For many of us, mornings are a blur of alarms, emails and scrambling out the door. But what if your coffee wasn't just fuel — it was a moment to pau...",
  },
  {
    slug: "upgrade-your-home-coffee",
    title: "5 Easy Ways to Upgrade Your Home Coffee Game",
    excerpt:
      "You don't need a café setup — or a counter full of fancy gear — to make great coffee at home. A few small tweaks can make a big difference in flavour, f...",
  },
] as const;

/** Footer shipping ticker. */
export const shippingTicker = `Shipping's on us for orders over ${site.freeShippingThreshold}`;

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

/** Homepage FAQ. */
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
      { title: "All", path: "/search" },
      { title: "Popular", path: "/search/popular" },
      { title: "Filter", path: "/search/filter" },
      { title: "Espresso", path: "/search/espresso" },
      { title: "Full list", path: "/search" },
    ],
  },
  {
    title: "More",
    links: [
      { title: "Merch", path: "/search/merch" },
      { title: "Blog", path: "/blogs" },
      { title: "Contact", path: "/contact" },
      { title: "FAQ", path: "/about" },
      { title: "Brew guide", path: "/blogs" },
    ],
  },
] as const;

export const socialLinks = [
  { title: "Instagram", href: "https://instagram.com" },
  { title: "Facebook", href: "https://facebook.com" },
  { title: "YouTube", href: "https://youtube.com" },
  { title: "WhatsApp", href: "https://wa.me/910000000000" },
  { title: "Email", href: "mailto:hello@vaishnaviestate.com" },
] as const;

/**
 * Estate philosophy band — the brand's own statement of intent, set as an
 * asymmetric two-column block rather than the centred `SectionHead` the
 * product rails use. `title` is split into lines deliberately: at
 * `display-xl` the break lands where the sentence breathes, which balance
 * alone will not guarantee across breakpoints.
 */
export const estatePhilosophy = {
  eyebrow: "Estate Philosophy",
  title: ["We believe coffee", " is an art form"],
  /**
   * Three paragraphs rather than one: the opening states the position, and
   * the two that follow are what earn it — the practice, then the people.
   * Kept as an array so the section can space them without `<br />`.
   */
  body: [
    "Set in the misty hills of Coorg since 1928, every cup of Vaishnavi Estate is the quiet sum of four generations - handcrafted beans, slow batch roasting, and an estate ritual that turns coffee into something closer to ceremony. Nothing here is rushed. Hand-picked at peak ripeness, pulped the same evening, and naturally dried on raised beds beneath native shade trees. Roasted in small batches and ground fresh only after you order.",
  ],
  cta: "Learn more",
  href: "/about",
} as const;

/**
 * The estate reel that follows the philosophy band: four staggered plates,
 * mixed stills and silent loops, each captioned with a lowercase mono label
 * and an italic serif line.
 *
 * `kind: "video"` cells autoplay muted and carry the LIVE badge; they are
 * decorative, so they take no alt text. Stills do — they carry information
 * the captions only allude to.
 */
export const estateReel = [
  {
    kind: "image",
    src: "https://vaishnaviestate.com/cdn/shop/files/Girl_drinking_coffee.jpg?v=1778496876&width=900",
    alt: "Two hands cradling a terracotta cup of filter coffee on a garden terrace, an estate pouch resting behind it.",
    label: "the pour",
    caption: "Slow extraction, served at golden hour",
  },
  {
    kind: "video",
    src: "https://cdn.shopify.com/videos/c/o/v/643e30e15c364663860fded49117578a.mp4",
    label: "the bean",
    caption: "Single-origin Robusta, hand-sorted",
  },
  {
    kind: "image",
    src: "https://vaishnaviestate.com/cdn/shop/files/vc-soc-web-13.jpg?v=1687196491&width=900",
    alt: "A level scoop of freshly ground coffee beside a glass pour-over carafe and an estate pouch.",
    label: "the dose",
    caption: "One level scoop, ground the morning it's brewed",
  },
  {
    kind: "video",
    src: "https://cdn.shopify.com/videos/c/o/v/81da4c142d584a23b09d68399eff9a18.mp4",
    label: "the ritual",
    caption: "Mornings made of mist and porcelain",
  },
] as const;
