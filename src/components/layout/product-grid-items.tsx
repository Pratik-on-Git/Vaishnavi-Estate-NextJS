import Grid from "../grid";
import ProductCard, { type ProductCardProduct } from "../product-card";

/**
 * The results grid.
 *
 * Takes the listing shape rather than the full `Product`, so the shop page can
 * render a grid from the one catalogue read it already has - see
 * `lib/shopify/fragments/product-card.ts` for why the two shapes are separate.
 */
export default function ProductGridItems({
  products,
  sizes,
}: {
  products: ProductCardProduct[];
  /** Match the grid's own column count, or the browser over-fetches images. */
  sizes?: string;
}) {
  return (
    <>
      {products.map((product, index) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <ProductCard product={product} priority={index < 3} sizes={sizes} />
        </Grid.Item>
      ))}
    </>
  );
}
