import clsx from "clsx";

/**
 * Formatted money. The currency code is suppressed by default — the symbol
 * carries it, and the reference price treatments are bare numerals. Pass
 * `showCurrencyCode` where the ambiguity actually matters (cart totals).
 */
const Price = ({
  amount,
  className,
  currencyCode = "INR",
  currencyCodeClassName,
  showCurrencyCode = false,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
  showCurrencyCode?: boolean;
} & React.ComponentProps<"p">) => (
  <p suppressHydrationWarning={true} className={className}>
    {`${new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 2,
    }).format(parseFloat(amount))}`}
    {showCurrencyCode ? (
      <span
        className={clsx("ml-1 inline", currencyCodeClassName)}
      >{`${currencyCode}`}</span>
    ) : null}
  </p>
);

export default Price;
