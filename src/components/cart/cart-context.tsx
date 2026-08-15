"use client";

import { MAX_LINE_QUANTITY } from "@/lib/constants";
import { Cart, CartItem, Money, Product, ProductVariant } from "@/lib/shopify/types";
import {
  createContext,
  use,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  useRef,
  useState,
} from "react";
import type { CartActionState } from "./actions";

type UpdateType = "plus" | "minus" | "delete";

type CartContextType = {
  cart: Cart | undefined;
  /** Applies an optimistic line change. Does not talk to the server. */
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  /** Applies an optimistic add. Does not talk to the server. */
  addCartItem: (variant: ProductVariant, product: Product) => void;
  /**
   * Serialises a cart mutation behind every mutation already in flight, so
   * overlapping requests can never be applied out of order.
   */
  runCartMutation: <T>(task: () => Promise<T>) => Promise<T>;
  /**
   * Reserves the absolute quantity a line should end up at, accounting for
   * clicks that have not reached the server yet. Independent of render timing.
   */
  reserveLineQuantity: (
    merchandiseId: string,
    delta: number,
    current: number
  ) => number;
  /** Reserves a removal (target quantity 0) for a line. */
  reserveLineRemoval: (merchandiseId: string) => void;
  /** Marks one reserved mutation for a line as settled. */
  settleLine: (merchandiseId: string) => void;
  isMutating: boolean;
  status: CartActionState;
  reportStatus: (status: CartActionState) => void;
  clearStatus: () => void;
};

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    };

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_CURRENCY = "INR";

/* --------------------------------- money --------------------------------- */

/**
 * Cart arithmetic runs in integer minor units. Doing it in floats produced
 * totals like 1799.9999999999998, and re-deriving a unit price by dividing the
 * line total compounded the drift on every click.
 */
function toMinor(amount: string | number | undefined | null): number {
  const value = Number(amount);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

function fromMinor(minor: number): string {
  return (minor / 100).toFixed(2);
}

function money(minor: number, currencyCode: string): Money {
  return { amount: fromMinor(minor), currencyCode };
}

/**
 * Per-unit price, most trustworthy source first. `amountPerQuantity` reflects
 * line-level discounts; the variant price is the next best; dividing the line
 * total is the last resort and is guarded against a zero quantity.
 */
function unitPriceMinor(item: CartItem): number {
  if (item.cost.amountPerQuantity?.amount != null) {
    return toMinor(item.cost.amountPerQuantity.amount);
  }
  if (item.merchandise.price?.amount != null) {
    return toMinor(item.merchandise.price.amount);
  }
  if (item.quantity > 0) {
    return Math.round(toMinor(item.cost.totalAmount.amount) / item.quantity);
  }
  return 0;
}

function cartCurrency(cart: Cart | undefined, lines: CartItem[]): string {
  return (
    cart?.cost?.totalAmount?.currencyCode ||
    lines[0]?.cost.totalAmount.currencyCode ||
    DEFAULT_CURRENCY
  );
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0.00", currencyCode: DEFAULT_CURRENCY },
      totalAmount: { amount: "0.00", currencyCode: DEFAULT_CURRENCY },
      totalTaxAmount: { amount: "0.00", currencyCode: DEFAULT_CURRENCY },
    },
  };
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 0;
  return Math.min(Math.max(Math.trunc(quantity), 0), MAX_LINE_QUANTITY);
}

/* -------------------------------- reducer -------------------------------- */

function applyUpdate(item: CartItem, updateType: UpdateType): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity = clampQuantity(
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1
  );

  if (newQuantity === 0) return null;
  // Already at the ceiling — hand back the same object so React can bail out.
  if (newQuantity === item.quantity) return item;

  const unit = unitPriceMinor(item);
  const currencyCode = item.cost.totalAmount.currencyCode;

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: money(unit * newQuantity, currencyCode),
    },
  };
}

/**
 * Recomputes the cart envelope from its lines. Tax is carried over from the
 * server rather than zeroed: the previous version reset it on every optimistic
 * change, so the "Taxes" row flickered to 0 and back on each click.
 */
function recalculateCart(cart: Cart, lines: CartItem[]): Cart {
  const currencyCode = cartCurrency(cart, lines);
  const subtotalMinor = lines.reduce(
    (sum, item) => sum + toMinor(item.cost.totalAmount.amount),
    0
  );
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  // An empty cart owes no tax; otherwise the server figure is the best estimate
  // until the next reconciliation.
  const taxMinor = lines.length
    ? toMinor(cart.cost?.totalTaxAmount?.amount)
    : 0;

  return {
    ...cart,
    lines,
    totalQuantity,
    cost: {
      subtotalAmount: money(subtotalMinor, currencyCode),
      totalAmount: money(subtotalMinor + taxMinor, currencyCode),
      totalTaxAmount: money(taxMinor, currencyCode),
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product
): CartItem {
  const quantity = clampQuantity((existingItem?.quantity ?? 0) + 1);
  const currencyCode =
    existingItem?.cost.totalAmount.currencyCode ??
    variant.price.currencyCode ??
    DEFAULT_CURRENCY;
  const unit = existingItem
    ? unitPriceMinor(existingItem)
    : toMinor(variant.price.amount);

  return {
    // Preserve the server line id so a follow-up mutation can address it.
    id: existingItem?.id,
    quantity,
    cost: {
      ...existingItem?.cost,
      totalAmount: money(unit * quantity, currencyCode),
      amountPerQuantity:
        existingItem?.cost.amountPerQuantity ??
        (variant.price.amount != null
          ? { amount: variant.price.amount, currencyCode }
          : undefined),
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      availableForSale: variant.availableForSale,
      price: variant.price,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? applyUpdate(item, updateType)
            : item
        )
        .filter((item): item is CartItem => item !== null);

      // No `lines.length === 0` special case any more — recalculateCart zeroes
      // subtotal, total AND tax. The old early return left subtotal and tax at
      // their pre-emptying values.
      return recalculateCart(currentCart, updatedLines);
    }
    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id
      );

      // Refuse to grow past the ceiling instead of showing a number the server
      // will reject.
      if (existingItem && existingItem.quantity >= MAX_LINE_QUANTITY) {
        return currentCart;
      }

      const updatedItem = createOrUpdateCartItem(existingItem, variant, product);
      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item
          )
        : [...currentCart.lines, updatedItem];

      return recalculateCart(currentCart, updatedLines);
    }
    default:
      return currentCart;
  }
}

/* -------------------------------- provider ------------------------------- */

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );
  const [pendingCount, setPendingCount] = useState(0);
  const [status, setStatus] = useState<CartActionState>(null);

  // Serial chain. Cart mutations send an *absolute* quantity, so two in-flight
  // requests that resolve out of order leave the cart at the wrong number.
  // Chaining them keeps the server's view in the same order as the clicks.
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());
  // Target quantity per line, including clicks that have not been sent yet.
  // `inFlight` is reference-counted so an early-settling mutation cannot drop
  // the intent that later queued mutations are still building on.
  const intentRef = useRef(
    new Map<string, { target: number; inFlight: number }>()
  );

  const runCartMutation = useCallback(<T,>(task: () => Promise<T>): Promise<T> => {
    setPendingCount((count) => count + 1);
    const run = queueRef.current.then(task, task).finally(() => {
      setPendingCount((count) => Math.max(0, count - 1));
    });
    // Swallow rejections on the chain itself so one failure cannot poison every
    // later mutation; the caller still sees its own rejection.
    queueRef.current = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }, []);

  const reserveLineQuantity = useCallback(
    (merchandiseId: string, delta: number, current: number) => {
      const entry = intentRef.current.get(merchandiseId);
      const target = clampQuantity((entry ? entry.target : current) + delta);
      intentRef.current.set(merchandiseId, {
        target,
        inFlight: (entry?.inFlight ?? 0) + 1,
      });
      return target;
    },
    []
  );

  const reserveLineRemoval = useCallback((merchandiseId: string) => {
    const entry = intentRef.current.get(merchandiseId);
    intentRef.current.set(merchandiseId, {
      target: 0,
      inFlight: (entry?.inFlight ?? 0) + 1,
    });
  }, []);

  const settleLine = useCallback((merchandiseId: string) => {
    const entry = intentRef.current.get(merchandiseId);
    if (!entry) return;
    const inFlight = entry.inFlight - 1;
    if (inFlight <= 0) {
      intentRef.current.delete(merchandiseId);
    } else {
      intentRef.current.set(merchandiseId, { ...entry, inFlight });
    }
  }, []);

  // A silent success clears the banner; anything with a message replaces it.
  const reportStatus = useCallback((result: CartActionState) => {
    setStatus(result?.message ? result : null);
  }, []);

  const clearStatus = useCallback(() => setStatus(null), []);

  const updateCartItem = useCallback(
    (merchandiseId: string, updateType: UpdateType) => {
      updateOptimisticCart({
        type: "UPDATE_ITEM",
        payload: { merchandiseId, updateType },
      });
    },
    [updateOptimisticCart]
  );

  const addCartItem = useCallback(
    (variant: ProductVariant, product: Product) => {
      updateOptimisticCart({ type: "ADD_ITEM", payload: { variant, product } });
    },
    [updateOptimisticCart]
  );

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
      runCartMutation,
      reserveLineQuantity,
      reserveLineRemoval,
      settleLine,
      isMutating: pendingCount > 0,
      status,
      reportStatus,
      clearStatus,
    }),
    [
      optimisticCart,
      updateCartItem,
      addCartItem,
      runCartMutation,
      reserveLineQuantity,
      reserveLineRemoval,
      settleLine,
      pendingCount,
      status,
      reportStatus,
      clearStatus,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
