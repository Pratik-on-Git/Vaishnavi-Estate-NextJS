"use client";

import { createUrl } from "@/lib/utils";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";
import clsx from "clsx";
import { brewFormats } from "@/lib/site";

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

/**
 * Inline search field. Used in the mobile menu and on the search results page,
 * where a persistent input reads better than a modal.
 */
export function SearchBar({
  autoFocus = false,
  className,
}: {
  autoFocus?: boolean;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const onSubmit = useSearchSubmit();

  return (
    <form onSubmit={onSubmit} className={clsx("relative w-full", className)}>
      <label htmlFor="site-search" className="sr-only">
        Search coffee
      </label>
      <input
        id="site-search"
        key={searchParams?.get("q")}
        type="text"
        name="search"
        autoFocus={autoFocus}
        placeholder="Search the estate…"
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="w-full border-b border-ink/25 bg-transparent py-4 pr-10 font-display text-2xl placeholder:text-ink-faint focus-visible:border-oxblood focus-visible:ring-0 md:text-3xl"
      />
      <MagnifyingGlassIcon
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
      />
    </form>
  );
}

/** Navbar affordance: opens a full-width search overlay. */
export default function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Search"
        className="flex items-center gap-2 font-mono text-spec uppercase tracking-micro text-ink-muted transition-colors hover:text-oxblood"
      >
        <MagnifyingGlassIcon aria-hidden className="h-4 w-4" />
        <span className="hidden lg:inline">Search</span>
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
            <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm" aria-hidden />
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
            <DialogPanel className="fixed inset-x-0 top-0 bg-paper pb-14 pt-8">
              <div className="shell">
                <div className="flex items-start justify-between gap-8">
                  <p className="eyebrow pt-2">Search</p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close search"
                    className="text-ink-muted transition-colors hover:text-oxblood"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-6">
                  <SearchOverlayForm onDone={() => setIsOpen(false)} />
                </div>
                <div className="mt-10">
                  <p className="eyebrow mb-4">Browse by brew</p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-3">
                    {brewFormats.map((format) => (
                      <li key={format.handle}>
                        <a
                          href={`/search/${format.handle}`}
                          onClick={() => setIsOpen(false)}
                          className="font-display text-xl italic transition-colors hover:text-oxblood"
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

function SearchOverlayForm({ onDone }: { onDone: () => void }) {
  const searchParams = useSearchParams();
  const onSubmit = useSearchSubmit(onDone);

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <label htmlFor="overlay-search" className="sr-only">
        Search coffee
      </label>
      <input
        id="overlay-search"
        type="text"
        name="search"
        autoFocus
        placeholder="Search the estate…"
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="w-full border-b border-ink/25 bg-transparent py-4 pr-10 font-display text-3xl placeholder:text-ink-faint focus-visible:border-oxblood focus-visible:ring-0 md:text-5xl"
      />
      <MagnifyingGlassIcon
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2 text-ink-muted"
      />
    </form>
  );
}

export function SearchSkeleton() {
  return (
    <div className="relative w-full">
      <div className="h-14 w-full animate-pulse border-b border-ink/15" />
    </div>
  );
}
