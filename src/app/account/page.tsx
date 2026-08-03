import Price from "@/components/price";
import {
  fetchCustomerAccount,
  getCustomerSession,
} from "@/lib/customer-account";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My account",
  description: "View your Shopify customer profile, addresses, and orders.",
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
      <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-6 py-16">
        <div className="w-full rounded-2xl border border-neutral-200 p-8 text-center dark:border-neutral-800">
          <h1 className="text-3xl font-semibold">Your account</h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Sign in securely with Shopify to see your profile, saved addresses,
            and order history. New customers can create an account on the same
            screen.
          </p>
          {error ? (
            <p role="alert" className="mt-4 text-sm text-red-600">
              We couldn&apos;t complete sign-in. Please try again.
            </p>
          ) : null}
          <Link
            href="/api/auth/login?returnTo=/account"
            className="mt-8 inline-flex rounded-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Sign in or create account
          </Link>
        </div>
      </main>
    );
  }

  if (session.isExpired) redirect("/api/auth/refresh?returnTo=/account");
  const customer = await fetchCustomerAccount(session.accessToken!);
  if (!customer) redirect("/api/auth/refresh?returnTo=/account");

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Welcome back</p>
          <h1 className="text-3xl font-semibold">{customer.displayName}</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            {customer.emailAddress?.emailAddress}
          </p>
        </div>
        <Link
          href="/api/auth/logout"
          className="rounded-full border border-neutral-300 px-5 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Sign out
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <section className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="text-xl font-semibold">Profile</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-neutral-500">Name</dt>
              <dd>{customer.displayName}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Email</dt>
              <dd>{customer.emailAddress?.emailAddress || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Phone</dt>
              <dd>{customer.phoneNumber?.phoneNumber || "Not provided"}</dd>
            </div>
          </dl>

          <h2 className="mt-8 text-xl font-semibold">Saved addresses</h2>
          {customer.addresses.nodes.length ? (
            <ul className="mt-4 space-y-4">
              {customer.addresses.nodes.map((address) => (
                <li key={address.id} className="rounded-xl bg-neutral-50 p-4 text-sm dark:bg-neutral-900">
                  {address.formatted.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-neutral-500">No saved addresses yet.</p>
          )}
        </section>

        <section className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="text-xl font-semibold">Order history</h2>
          {customer.orders.nodes.length ? (
            <ul className="mt-5 divide-y divide-neutral-200 dark:divide-neutral-800">
              {customer.orders.nodes.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-medium">{order.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(order.processedAt))}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">
                      {[order.financialStatus, order.fulfillmentStatus].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <Price
                      amount={order.totalPrice.amount}
                      currencyCode={order.totalPrice.currencyCode}
                    />
                    {order.statusPageUrl ? (
                      <a href={order.statusPageUrl} className="mt-2 block text-sm text-blue-600 hover:underline">
                        View order
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center">
              <p className="text-neutral-500">You haven&apos;t placed an order yet.</p>
              <Link href="/search" className="mt-4 inline-block text-blue-600 hover:underline">
                Start shopping
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
