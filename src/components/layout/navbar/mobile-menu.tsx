"use client";

import { Menu } from "@/lib/shopify/types";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, useState } from "react";
import { SearchBar } from "./search";
import { brewFormats, site, socialLinks } from "@/lib/site";
import LogoSquare from "@/components/logo-square";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="flex items-center text-ink transition-colors hover:text-oxblood"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={close} className="relative z-[1000]">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-espresso/40" aria-hidden />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition-transform ease-editorial duration-500"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="fixed inset-y-0 left-0 flex w-full max-w-md flex-col overflow-y-auto bg-paper">
              <div className="flex items-center justify-between border-b border-ink/15 px-5 py-5">
                <Link href="/" onClick={close}>
                  <LogoSquare size="sm" />
                </Link>
                <button onClick={close} aria-label="Close menu">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="px-5 py-6">
                <SearchBar />
              </div>

              <nav className="px-5">
                <ul className="flex flex-col">
                  {menu.map((item: Menu) => (
                    <li key={item.title} className="border-b border-ink/10">
                      <Link
                        href={item.path}
                        prefetch
                        onClick={close}
                        className="block py-4 font-display text-3xl transition-colors hover:text-oxblood"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="eyebrow mb-4 mt-10">Browse by brew</p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {brewFormats.map((format) => (
                    <li key={format.handle}>
                      <Link
                        href={`/search/${format.handle}`}
                        onClick={close}
                        className="font-display text-lg italic transition-colors hover:text-oxblood"
                      >
                        {format.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto border-t border-ink/15 px-5 py-6">
                <Link
                  href="/account"
                  onClick={close}
                  className="link-rule mb-6 inline-block"
                >
                  My account
                </Link>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {socialLinks.map((social) => (
                    <li key={social.title}>
                      <a href={social.href} className="eyebrow hover:text-oxblood">
                        {social.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="eyebrow mt-6">
                  {site.origin} · Est. {site.since}
                </p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
