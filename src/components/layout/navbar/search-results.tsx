"use client";

import type { SearchResult } from "@/app/api/search/route";
import Price from "@/components/price";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { createUrl } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, KeyboardEvent } from "react";

type Props = {
  query: string;
  results: SearchResult;
  isLoading: boolean;
  onSelect: (href: string) => void;
};

type Item =
  | { kind: "product"; href: string; label: string; price: string; currencyCode: string; image: string | null; altText: string }
  | { kind: "collection"; href: string; label: string }
  | { kind: "page"; href: string; label: string }
  | { kind: "all"; href: string; label: string };

function buildItems(query: string, results: SearchResult): Item[] {
  const items: Item[] = [];

  for (const p of results.products) {
    items.push({
      kind: "product",
      href: `/product/${p.handle}`,
      label: p.title,
      price: p.price,
      currencyCode: p.currencyCode,
      image: p.image,
      altText: p.altText,
    });
  }

  for (const c of results.collections) {
    items.push({
      kind: "collection",
      href: `/search/${c.handle}`,
      label: c.title,
    });
  }

  for (const pg of results.pages) {
    items.push({
      kind: "page",
      href: `/${pg.handle}`,
      label: pg.title,
    });
  }

  // "See all results" footer
  const params = new URLSearchParams({ q: query });
  items.push({
    kind: "all",
    href: createUrl("/search", params),
    label: `See all results for "${query}"`,
  });

  return items;
}

function sectionLabel(kind: Item["kind"]): string {
  if (kind === "product") return "Products";
  if (kind === "collection") return "Collections";
  if (kind === "page") return "Pages";
  return "";
}

/**
 * Floating dropdown of instant-search results.
 * Handles keyboard navigation internally; calls onSelect(href) when an item
 * is activated via click or keyboard.
 */
export default function SearchResults({ query, results, isLoading, onSelect }: Props) {
  const items = buildItems(query, results);
  const listRef = useRef<HTMLUListElement>(null);
  const activeIndex = useRef(-1);

  // Expose keyboard handling so the parent <input> can forward its events here.
  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (!listRef.current) return;
    const els = Array.from(listRef.current.querySelectorAll<HTMLElement>("[data-sr-item]"));
    if (!els.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex.current = Math.min(activeIndex.current + 1, els.length - 1);
      els[activeIndex.current]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex.current = Math.max(activeIndex.current - 1, 0);
      els[activeIndex.current]?.focus();
    }
  }

  // Reset active index when results change
  useEffect(() => {
    activeIndex.current = -1;
  }, [results]);

  const isEmpty = results.products.length === 0 && results.collections.length === 0 && results.pages.length === 0;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-plate border border-rule bg-paper shadow-[0_8px_40px_rgba(52,23,6,0.14)]"
      onKeyDown={handleKeyDown}
    >
      {isLoading && isEmpty && (
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-oxblood border-t-transparent" />
          <span className="eyebrow">Searching…</span>
        </div>
      )}

      {!isLoading && isEmpty && (
        <div className="px-5 py-6 text-center">
          <p className="body-mono text-ink-soft">No results found</p>
          <button
            data-sr-item
            onClick={() => onSelect(createUrl("/search", new URLSearchParams({ q: query })))}
            className="btn-outline mt-4 text-sm"
          >
            Browse all products
          </button>
        </div>
      )}

      {!isEmpty && (
        <ul ref={listRef} role="listbox" aria-label="Search results" className="max-h-[70vh] overflow-y-auto py-2">
          {/* Products */}
          {results.products.length > 0 && (
            <>
              <li className="px-5 pb-1 pt-3">
                <span className="eyebrow text-ink-soft" style={{ fontSize: "0.6rem" }}>Products</span>
              </li>
              {results.products.map((product) => (
                <li key={`product-${product.handle}`} role="option" aria-selected="false">
                  <button
                    data-sr-item
                    tabIndex={0}
                    onClick={() => onSelect(`/product/${product.handle}`)}
                    className="flex w-full items-center gap-4 px-5 py-3 transition-colors hover:bg-wash focus-visible:bg-wash focus-visible:outline-none"
                  >
                    {/* Thumbnail */}
                    <span className="plate h-12 w-12 flex-none">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.altText}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          <MagnifyingGlassIcon className="h-5 w-5 text-ink-soft opacity-40" />
                        </span>
                      )}
                    </span>

                    {/* Label + price */}
                    <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                      <span className="body-mono truncate font-medium">{product.title}</span>
                      <Price
                        amount={product.price}
                        currencyCode={product.currencyCode}
                        className="spec-mono"
                      />
                    </span>
                  </button>
                </li>
              ))}
            </>
          )}

          {/* Collections */}
          {results.collections.length > 0 && (
            <>
              <li className="px-5 pb-1 pt-3">
                <span className="eyebrow text-ink-soft" style={{ fontSize: "0.6rem" }}>Collections</span>
              </li>
              {results.collections.map((col) => (
                <li key={`col-${col.handle}`} role="option" aria-selected="false">
                  <button
                    data-sr-item
                    tabIndex={0}
                    onClick={() => onSelect(`/search/${col.handle}`)}
                    className="flex w-full items-center gap-3 px-5 py-3 transition-colors hover:bg-wash focus-visible:bg-wash focus-visible:outline-none"
                  >
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-rule">
                      <MagnifyingGlassIcon className="h-3.5 w-3.5 text-ink-soft" />
                    </span>
                    <span className="body-mono text-left">{col.title}</span>
                    <span className="ml-auto spec-mono text-ink-soft">Collection</span>
                  </button>
                </li>
              ))}
            </>
          )}

          {/* Pages */}
          {results.pages.length > 0 && (
            <>
              <li className="px-5 pb-1 pt-3">
                <span className="eyebrow text-ink-soft" style={{ fontSize: "0.6rem" }}>Pages</span>
              </li>
              {results.pages.map((pg) => (
                <li key={`page-${pg.handle}`} role="option" aria-selected="false">
                  <button
                    data-sr-item
                    tabIndex={0}
                    onClick={() => onSelect(`/${pg.handle}`)}
                    className="flex w-full items-center gap-3 px-5 py-3 transition-colors hover:bg-wash focus-visible:bg-wash focus-visible:outline-none"
                  >
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-rule">
                      <span className="spec-mono text-ink-soft">P</span>
                    </span>
                    <span className="body-mono text-left">{pg.title}</span>
                    <span className="ml-auto spec-mono text-ink-soft">Page</span>
                  </button>
                </li>
              ))}
            </>
          )}

          {/* See all results footer */}
          <li className="border-t border-rule" role="option" aria-selected="false">
            <button
              data-sr-item
              tabIndex={0}
              onClick={() => onSelect(createUrl("/search", new URLSearchParams({ q: query })))}
              className="flex w-full items-center gap-3 px-5 py-4 transition-colors hover:bg-wash focus-visible:bg-wash focus-visible:outline-none"
            >
              <MagnifyingGlassIcon className="h-4 w-4 flex-none text-oxblood" />
              <span className="ui-mono text-oxblood">
                See all results for &ldquo;{query}&rdquo;
              </span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
