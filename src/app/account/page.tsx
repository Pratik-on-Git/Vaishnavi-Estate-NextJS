import Price from "@/components/price";
import { Eyebrow, Headline } from "@/components/ui/section";
import {
  fetchCustomerAccount,
  getCustomerSession,
} from "@/lib/customer-account";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My account",
  description: "View your profile, addresses, and order history.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return (
      <div className="shell flex min-h-[60vh] items-center py-20">
        <div className="mx-auto w-full max-w-lg border border-ink/15 p-10 text-center">
          <Eyebrow>Account</Eyebrow>
          <Headline as="h1" size="sm" className="mt-5">
            Sign in to your account
          </Headline>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted">
            Sign in securely with Shopify to see your profile, saved addresses
            and order history. New customers can create an account on the same
            screen.
          </p>
          {error ? (
            <p role="alert" className="mt-5 font-mono text-spec uppercase tracking-micro text-oxblood">
              We couldn&apos;t complete sign-in. Please try again.
            </p>
          ) : null}
          <Link
            href="/api/auth/login?returnTo=/account"
            className="btn-primary mt-8"
          >
            Sign in or create account
          </Link>
        </div>
      </div>
    );
  }

  if (session.isExpired) redirect("/api/auth/refresh?returnTo=/account");
  const customer = await fetchCustomerAccount(session.accessToken!);
  if (!customer) redirect("/api/auth/refresh?returnTo=/account");

  return (
    <div className="shell py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/15 pb-10">
        <div>
          <Eyebrow>Welcome back</Eyebrow>
          <h1 className="mt-4 font-display text-display-sm">
            {customer.displayName}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {customer.emailAddress?.emailAddress}
          </p>
        </div>
        <Link href="/api/auth/logout" className="btn-ghost">
          Sign out
        </Link>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <section className="lg:col-span-4">
          <Eyebrow index="01">Profile</Eyebrow>
          <dl className="mt-6 space-y-5 border-t border-ink/15 pt-6">
            {[
              { term: "Name", value: customer.displayName },
              {
                term: "Email",
                value: customer.emailAddress?.emailAddress || "Not provided",
              },
              {
                term: "Phone",
                value: customer.phoneNumber?.phoneNumber || "Not provided",
              },
            ].map((row) => (
              <div key={row.term}>
                <dt className="eyebrow">{row.term}</dt>
                <dd className="mt-1.5 font-display text-lg">{row.value}</dd>
              </div>
            ))}
          </dl>

          <Eyebrow index="02" className="mt-12">
            Saved addresses
          </Eyebrow>
          {customer.addresses.nodes.length ? (
            <ul className="mt-6 space-y-px border-t border-ink/15">
              {customer.addresses.nodes.map((address) => (
                <li
                  key={address.id}
                  className="border-b border-ink/12 py-4 text-sm leading-relaxed text-ink-muted"
                >
                  {address.formatted.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 border-t border-ink/15 pt-6 text-sm text-ink-muted">
              No saved addresses yet.
            </p>
          )}
        </section>

        <section className="lg:col-span-7 lg:col-start-6">
          <Eyebrow index="03">Order history</Eyebrow>
          {customer.orders.nodes.length ? (
            <ul className="mt-6 border-t border-ink/15">
              {customer.orders.nodes.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-start justify-between gap-6 border-b border-ink/12 py-6"
                >
                  <div>
                    <p className="font-display text-xl">{order.name}</p>
                    <p className="mt-1.5 text-sm text-ink-muted">
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                      }).format(new Date(order.processedAt))}
                    </p>
                    <p className="eyebrow mt-2">
                      {[order.financialStatus, order.fulfillmentStatus]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <Price
                      className="font-display text-xl text-oxblood"
                      amount={order.totalPrice.amount}
                      currencyCode={order.totalPrice.currencyCode}
                    />
                    {order.statusPageUrl ? (
                      <a
                        href={order.statusPageUrl}
                        className="link-rule mt-3 inline-block"
                      >
                        View order
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 border border-ink/15 px-8 py-16 text-center">
              <p className="font-display text-2xl">No orders yet</p>
              <p className="mt-3 text-sm text-ink-muted">
                Your first bag from the estate is waiting.
              </p>
              <Link href="/search" className="btn-ghost mt-8">
                Start shopping
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
