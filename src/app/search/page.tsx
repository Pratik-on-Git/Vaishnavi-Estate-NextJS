import ShopView from "@/components/shop/shop-view";
import { site } from "@/lib/site";

export const metadata = {
  title: "Shop coffee",
  description: "Search single-origin Coorg Robusta from Vaishnavi Estate.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  return (
    <ShopView
      basePath="/search"
      eyebrow="The shop"
      title="Every bag from a single estate"
      description={site.description}
      searchParams={(await searchParams) ?? {}}
    />
  );
}
