"use client";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useCart } from "./cart-context";
import { createUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Price from "../price";
import OpenCart from "./open-cart";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DEFAULT_OPTION } from "@/lib/constants";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import type { CartItem } from "@/lib/shopify/types";
import clsx from "clsx";

type MerchandiseSearchParams = {
  [key: string]: string;
};

/**
 * Deterministic ordering. Sorting on product title alone left variants of the
 * same product in an unstable order, so lines visibly swapped places whenever
 * the cart re-rendered.
 */
function compareLines(a: CartItem, b: CartItem): number {
  const byProduct = a.merchandise.product.title.localeCompare(
    b.merchandise.product.title
  );
  if (byProduct !== 0) return byProduct;

  const byVariant = a.merchandise.title.localeCompare(b.merchandise.title);
  if (byVariant !== 0) return byVariant;

  return a.merchandise.id.localeCompare(b.merchandise.id);
}

export default function CartModal() {
  const { cart, isMutating, status, clearStatus } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity ?? 0);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalQuantity = cart?.totalQuantity ?? 0;

  // No cart is pre-created any more. `addItem` creates one on demand inside the
  // same action that adds the line, which removes the first-visit race where a
  // quick click hit a missing cookie, and stops the site minting a Shopify cart
  // for every visitor who never adds anything.

  useEffect(() => {
    // Only a genuine *increase* pops the drawer. The old condition fired on
    // decrements too, so removing an item could yank the drawer back open.
    if (totalQuantity > quantityRef.current && !isOpen) {
      setIsOpen(true);
    }
    quantityRef.current = totalQuantity;
  }, [totalQuantity, isOpen]);

  // Stale banner from a previous interaction shouldn't greet the next open.
  useEffect(() => {
    if (!isOpen) clearStatus();
  }, [isOpen, clearStatus]);

  // Copy before sorting: `cart.lines` is optimistic state, and sorting it in
  // place mutated React state during render. Memoization is left to the React
  // Compiler, which is enabled for this project.
  const lines = cart?.lines ? [...cart.lines].sort(compareLines) : [];

  const hasUnavailableLine = lines.some(
    (line) => line.merchandise.availableForSale === false
  );
  const canCheckout = Boolean(cart?.checkoutUrl) && !isMutating && lines.length > 0;

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-[1000]">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-espresso/50 backdrop-blur-sm" aria-hidden />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition-transform ease-editorial duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed inset-y-0 right-0 flex w-full flex-col bg-paper text-ink md:w-[26rem]">
              <div className="flex items-center justify-between border-b border-ink/15 px-6 py-5">
                <p className="eyebrow">
                  Your order
                  {totalQuantity ? ` · ${totalQuantity}` : ""}
                </p>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="text-ink-muted transition-colors hover:text-oxblood"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {status?.message ? (
                <p
                  role={status.ok ? "status" : "alert"}
                  aria-live="polite"
                  className={clsx(
                    "border-b px-6 py-3 font-mono text-spec",
                    status.ok
                      ? "border-ink/15 bg-paper-100 text-ink-muted"
                      : "border-oxblood/25 bg-oxblood/5 text-oxblood"
                  )}
                >
                  {status.message}
                </p>
              ) : null}

              {lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <p className="font-display text-3xl">Your cart is empty</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    Nothing picked yet. The current harvest is waiting.
                  </p>
                  <Link href="/search" onClick={closeCart} className="btn-primary mt-8">
                    Shop coffee
                  </Link>
                </div>
              ) : (
                <div className="flex h-full flex-col overflow-hidden">
                  <ul className="flex-grow overflow-auto px-6">
                    {lines.map((item) => {
                      const merchandiseSearchParams =
                        {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(
                        ({ name, value }) => {
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[name.toLocaleLowerCase()] =
                              value;
                          }
                        }
                      );
                      const merchandiseUrl = createUrl(
                        `/product/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );
                      const isUnavailable =
                        item.merchandise.availableForSale === false;

                      return (
                        <li
                          // Keyed by variant, not list index. With an index key
                          // a sorted list reassigned rows to different products
                          // on every change.
                          key={item.merchandise.id}
                          className="flex gap-4 border-b border-ink/12 py-5"
                        >
                          <Link
                            href={merchandiseUrl}
                            onClick={closeCart}
                            className="relative h-24 w-20 shrink-0 overflow-hidden border border-ink/12 bg-paper-100"
                          >
                            {item.merchandise.product.featuredImage?.url ? (
                              <Image
                                className="h-full w-full object-cover"
                                fill
                                sizes="80px"
                                alt={
                                  item.merchandise.product.featuredImage
                                    .altText || item.merchandise.product.title
                                }
                                src={item.merchandise.product.featuredImage.url}
                              />
                            ) : null}
                          </Link>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="min-w-0"
                              >
                                <p className="font-display text-lg leading-tight">
                                  {item.merchandise.product.title}
                                </p>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="eyebrow mt-1.5">
                                    {item.merchandise.title}
                                  </p>
                                ) : null}
                                {isUnavailable ? (
                                  <p className="mt-1.5 font-mono text-spec uppercase tracking-micro text-oxblood">
                                    Out of stock
                                  </p>
                                ) : null}
                              </Link>
                              <DeleteItemButton item={item} />
                            </div>

                            <div className="mt-auto flex items-end justify-between pt-4">
                              <div className="flex items-center border border-ink/20">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                />
                                <span className="w-8 text-center font-mono text-spec">
                                  {item.quantity}
                                </span>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                />
                              </div>
                              <Price
                                className="font-mono text-spec tracking-micro"
                                amount={item.cost.totalAmount.amount}
                                currencyCode={item.cost.totalAmount.currencyCode}
                              />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="border-t border-ink/15 px-6 py-5">
                    <dl className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <dt className="eyebrow">Taxes</dt>
                        <dd>
                          <Price
                            className="font-mono text-spec"
                            amount={cart!.cost.totalTaxAmount.amount}
                            currencyCode={
                              cart!.cost.totalTaxAmount.currencyCode
                            }
                          />
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="eyebrow">Shipping</dt>
                        <dd className="font-mono text-spec">
                          Free across India
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between border-t border-ink/15 pt-3">
                        <dt className="eyebrow">Total</dt>
                        <dd>
                          <Price
                            className="font-display text-2xl text-oxblood"
                            amount={cart!.cost.totalAmount.amount}
                            currencyCode={cart!.cost.totalAmount.currencyCode}
                            showCurrencyCode
                            currencyCodeClassName="font-mono text-spec text-ink-muted"
                          />
                        </dd>
                      </div>
                    </dl>

                    {hasUnavailableLine ? (
                      <p className="mt-4 font-mono text-spec text-oxblood">
                        Remove the out-of-stock items to check out.
                      </p>
                    ) : null}

                    {/* Held back while a mutation is in flight: the checkout URL
                        is only as current as the cart behind it, and sending a
                        customer mid-update checks them out against the previous
                        contents. */}
                    {canCheckout ? (
                      <a href={cart!.checkoutUrl} className="btn-primary mt-5 w-full">
                        Proceed to checkout
                      </a>
                    ) : (
                      <button
                        disabled
                        aria-busy={isMutating}
                        className="btn-primary mt-5 w-full cursor-wait opacity-70"
                      >
                        {isMutating ? "Updating…" : "Proceed to checkout"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
