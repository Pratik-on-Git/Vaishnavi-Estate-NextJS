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
import { createCartAndSetCookie } from "./actions";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        const timeout = window.setTimeout(() => setIsOpen(true), 0);
        quantityRef.current = cart.totalQuantity;
        return () => window.clearTimeout(timeout);
      }

      quantityRef.current = cart.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
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
                  {cart?.totalQuantity ? ` · ${cart.totalQuantity}` : ""}
                </p>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="text-ink-muted transition-colors hover:text-oxblood"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
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
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title
                        )
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[
                                name.toLocaleLowerCase()
                              ] = value;
                            }
                          }
                        );
                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );

                        return (
                          <li
                            key={i}
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
                                  src={
                                    item.merchandise.product.featuredImage.url
                                  }
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
                                </Link>
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>

                              <div className="mt-auto flex items-end justify-between pt-4">
                                <div className="flex items-center border border-ink/20">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <span className="w-8 text-center font-mono text-spec">
                                    {item.quantity}
                                  </span>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                                <Price
                                  className="font-mono text-spec tracking-micro"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
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
                            amount={cart.cost.totalTaxAmount.amount}
                            currencyCode={cart.cost.totalTaxAmount.currencyCode}
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
                            amount={cart.cost.totalAmount.amount}
                            currencyCode={cart.cost.totalAmount.currencyCode}
                            showCurrencyCode
                            currencyCodeClassName="font-mono text-spec text-ink-muted"
                          />
                        </dd>
                      </div>
                    </dl>

                    <a href={cart.checkoutUrl} className="btn-primary mt-5 w-full">
                      Proceed to checkout
                    </a>
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
