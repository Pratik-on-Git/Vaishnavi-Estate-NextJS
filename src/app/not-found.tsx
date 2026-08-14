import Link from "next/link";
import { Eyebrow, Headline } from "@/components/ui/section";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-24">
      <Eyebrow>Error 404</Eyebrow>
      <Headline className="mt-6" accent="on this estate">
        We could not find that
      </Headline>
      <p className="mt-8 max-w-prose2 text-sm leading-relaxed text-ink-muted">
        The page you are looking for has been moved or never existed. The
        current harvest is still on the shelf.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/search" className="btn-primary">
          Shop coffee
        </Link>
        <Link href="/" className="btn-ghost">
          Back home
        </Link>
      </div>
    </div>
  );
}
