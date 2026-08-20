/** srctype {import('next').NextConfig} */
module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
  async redirects() {
    return [
      // The journal moved onto the Shopify blog API and now lives at the same
      // paths Shopify serves. Keep the old editorial URLs resolving.
      { source: "/journal", destination: "/blogs", permanent: true },
      { source: "/journal/:slug", destination: "/blogs", permanent: false },
    ];
  },
};
