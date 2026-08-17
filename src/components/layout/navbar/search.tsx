"use client";

import { createUrl } from "@/lib/utils";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useRef, useState, useEffect, useCallback, KeyboardEvent } from "react";
import clsx from "clsx";
import { brewFormats } from "@/lib/site";
import { useInstantSearch } from "@/hooks/use-instant-search";
import SearchResults from "./search-results";

// ---------------------------------------------------------------------------
// Shared form-submit handler (Enter key → /search?q=)
// ---------------------------------------------------------------------------
function useSearchSubmit(onDone?: () => void) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const search = form.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());
    const query = search.value.trim().replace(/\s+/g, " ");

    newParams.delete("collection");

    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }

    onDone?.();
    router.push(createUrl("/search", newParams));
  };
}

// ---------------------------------------------------------------------------
// SearchBar — inline bar used in the mobile sidebar and the search results page
// ---------------------------------------------------------------------------
export function SearchBar({
  autoFocus = false,
  className,
}: {
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onSubmit = useSearchSubmit();

  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const { results, hasResults, isLoading } = useInstantSearch(query);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Show results whenever there are any and query is non-empty
  useEffect(() => {
    setShowResults(!!query.trim() && (hasResults || isLoading));
  }, [query, hasResults, isLoading]);

  // Close dropdown on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function handleSelect(href: string) {
    setShowResults(false);
    setQuery("");
    router.push(href);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setShowResults(false);
    }
  }

  return (
    <div ref={containerRef} className={clsx("relative w-full", className)}>
      <form onSubmit={onSubmit}>
        <label htmlFor="site-search" className="sr-only">
          Search
        </label>
        <input
          id="site-search"
          key={searchParams?.get("q")}
          type="text"
          name="search"
          autoFocus={autoFocus}
          placeholder="Search the estate…"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim() && (hasResults || isLoading)) setShowResults(true);
          }}
          onKeyDown={handleKeyDown}
          className="serif w-full border-b border-rule bg-transparent py-4 pr-10 text-display-md focus-visible:border-oxblood focus-visible:ring-0"
        />
        <MagnifyingGlassIcon
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2"
        />
      </form>

      {/* Instant results */}
      {showResults && (
        <SearchResults
          query={query}
          results={results}
          isLoading={isLoading}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchTrigger — navbar affordance; opens full-width overlay
// ---------------------------------------------------------------------------
export default function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Search"
        className="ui-mono flex items-center gap-2 transition-opacity hover:opacity-60"
      >
        <span className="hidden sm:inline">Search</span>
        <MagnifyingGlassIcon aria-hidden className="h-4 w-4 sm:hidden" />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-[1000]">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-coal/40 backdrop-blur-sm" aria-hidden />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition-transform ease-editorial duration-500"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transition-transform ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
          >
            <DialogPanel
              data-lenis-prevent
              className="rule-b fixed inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-paper pb-12 pt-8"
            >
              <div className="shell">
                <div className="flex items-start justify-between gap-8">
                  <p className="eyebrow pt-2">Search</p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close search"
                    className="transition-opacity hover:opacity-60"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-6">
                  <SearchOverlayForm onDone={() => setIsOpen(false)} />
                </div>
                <div className="mt-10">
                  <p className="eyebrow mb-4">Browse by brew</p>
                  <ul className="flex flex-wrap gap-2">
                    {brewFormats.map((format) => (
                      <li key={format.handle}>
                        <a
                          href={`/search/${format.handle}`}
                          onClick={() => setIsOpen(false)}
                          className="pill text-display-sm"
                        >
                          {format.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}

// ---------------------------------------------------------------------------
// SearchOverlayForm — the large controlled input inside the overlay
// ---------------------------------------------------------------------------
function SearchOverlayForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onSubmit = useSearchSubmit(onDone);

  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const { results, hasResults, isLoading } = useInstantSearch(query);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowResults(!!query.trim() && (hasResults || isLoading));
  }, [query, hasResults, isLoading]);

  // Close on outside click (inside the overlay)
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function handleSelect(href: string) {
    setShowResults(false);
    setQuery("");
    onDone();
    router.push(href);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      if (showResults) {
        setShowResults(false);
      } else {
        onDone();
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={onSubmit}>
        <label htmlFor="overlay-search" className="sr-only">
          Search
        </label>
        <input
          id="overlay-search"
          type="text"
          name="search"
          autoFocus
          placeholder="Search the estate…"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim() && (hasResults || isLoading)) setShowResults(true);
          }}
          onKeyDown={handleKeyDown}
          className="serif w-full border-b border-rule bg-transparent py-4 pr-10 text-display-xl focus-visible:border-oxblood focus-visible:ring-0"
        />
        <MagnifyingGlassIcon
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2"
        />
      </form>

      {/* Instant results dropdown */}
      {showResults && (
        <SearchResults
          query={query}
          results={results}
          isLoading={isLoading}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchSkeleton — used in Suspense fallbacks
// ---------------------------------------------------------------------------
export function SearchSkeleton() {
  return (
    <div className="relative w-full">
      <div className="h-14 w-full animate-pulse border-b border-rule" />
    </div>
  );
}
