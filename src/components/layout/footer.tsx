import { getMenu } from "@/lib/shopify";
import { Menu } from "@/lib/shopify/types";
import Link from "next/link";
import { footerColumns, site, socialLinks } from "@/lib/site";
import Newsletter from "@/components/ui/newsletter";

export default async function Footer() {
  // Shopify owns the legal/policy links; the rest of the footer is editorial.
  const legalMenu: Menu[] = await getMenu("next-js-footer-menu");
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-espresso text-paper">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="eyebrow-inverse">Keep in touch</p>
            <p className="mt-5 max-w-prose2 font-display text-2xl leading-snug md:text-3xl">
              Harvest notes, roast releases and the occasional word from the
              estate.
            </p>
            <div className="mt-8">
              <Newsletter inverse />
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="md:col-span-2">
              <p className="eyebrow-inverse mb-5">{column.title}</p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.path}
                      className="text-sm text-paper/75 transition-colors hover:text-clay"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1">
            <p className="eyebrow-inverse mb-5">Social</p>
            <ul className="space-y-3">
              {socialLinks.map((social) => (
                <li key={social.title}>
                  <a
                    href={social.href}
                    className="text-sm text-paper/75 transition-colors hover:text-clay"
                  >
                    {social.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Oversized wordmark band, cropped by the viewport as in the reference. */}
      <div className="overflow-hidden border-t border-paper/15">
        <p
          aria-hidden
          className="shell select-none whitespace-nowrap py-6 text-center text-wordmark text-display-lg leading-none text-paper/10"
        >
          {site.wordmark} {site.wordmarkAccent}
        </p>
      </div>

      <div className="border-t border-paper/15">
        <div className="shell flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="eyebrow-inverse">
            &copy; {year} {site.name} · {site.origin}
          </p>
          {legalMenu.length ? (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalMenu.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    className="eyebrow-inverse hover:text-clay"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="eyebrow-inverse">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
