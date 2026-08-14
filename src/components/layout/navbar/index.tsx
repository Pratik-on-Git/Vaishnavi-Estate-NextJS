import { getMenu } from "@/lib/shopify";
import { Menu } from "@/lib/shopify/types";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import SearchTrigger from "./search";
import LogoSquare from "@/components/logo-square";
import CartModal from "@/components/cart/modal";
import { getCustomerSession } from "@/lib/customer-account";
import { primaryNav, site } from "@/lib/site";

export async function Navbar() {
  const shopifyMenu = await getMenu("vaishnavi-estate-nextjs-menu");
  const customerSession = await getCustomerSession();

  // Shopify owns the menu when it is configured; the site config is the
  // fallback so the nav is never empty on a fresh store.
  const menu: Menu[] = shopifyMenu.length ? shopifyMenu : primaryNav;

  return (
    <header className="sticky top-0 z-[999]">
      {/* Announcement strip — the estate's standing promises. */}
      <div className="bg-oxblood text-paper">
        <div className="shell flex h-9 items-center justify-center gap-6 overflow-hidden">
          <p className="eyebrow-inverse whitespace-nowrap">
            Free shipping across India
          </p>
          <span aria-hidden className="text-[0.4rem] opacity-50">
            &#9679;
          </span>
          <p className="eyebrow-inverse hidden whitespace-nowrap sm:block">
            Roasted daily · Ground on order
          </p>
          <span aria-hidden className="hidden text-[0.4rem] opacity-50 md:block">
            &#9679;
          </span>
          <p className="eyebrow-inverse hidden whitespace-nowrap md:block">
            {site.tagline}
          </p>
        </div>
      </div>

      <nav className="border-b border-ink/15 bg-paper/90 backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between gap-4 md:h-20">
          <div className="flex items-center gap-8">
            <div className="md:hidden">
              <MobileMenu menu={menu} />
            </div>
            <Link href="/" prefetch aria-label={`${site.name} home`}>
              <LogoSquare />
            </Link>
          </div>

          <ul className="hidden items-center gap-9 md:flex">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch
                  className="font-mono text-spec uppercase tracking-micro text-ink-muted transition-colors hover:text-oxblood"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <SearchTrigger />
            <Link
              href={
                customerSession.isAuthenticated
                  ? "/account"
                  : "/api/auth/login?returnTo=/account"
              }
              className="hidden font-mono text-spec uppercase tracking-micro text-ink-muted transition-colors hover:text-oxblood sm:block"
            >
              {customerSession.isAuthenticated ? "Account" : "Sign in"}
            </Link>
            <CartModal />
          </div>
        </div>
      </nav>
    </header>
  );
}
