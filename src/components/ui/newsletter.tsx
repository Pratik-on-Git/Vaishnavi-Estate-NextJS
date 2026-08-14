"use client";

import { useState } from "react";

/**
 * Newsletter capture. Deliberately client-side and self-contained: there is no
 * subscriber backend wired up yet, so this validates and acknowledges without
 * claiming to have stored anything. Point `onSubmit` at a route handler or
 * Shopify customer-marketing mutation when that endpoint exists.
 */
export default function Newsletter({ inverse = false }: { inverse?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");

  const line = inverse ? "border-paper/40" : "border-ink/30";
  const muted = inverse ? "text-paper/60" : "text-ink-muted";

  if (status === "done") {
    return (
      <p className={`font-mono text-spec uppercase tracking-micro ${muted}`}>
        Thank you — we&apos;ll write when the next harvest is roasted.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (email.trim()) setStatus("done");
      }}
      className="w-full max-w-md"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className={`flex items-center gap-4 border-b ${line} pb-3`}>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          className={`w-full bg-transparent font-mono text-spec uppercase tracking-micro placeholder:opacity-40 focus-visible:ring-0 ${
            inverse ? "text-paper" : "text-ink"
          }`}
        />
        <button type="submit" className="link-rule shrink-0">
          Sign up
        </button>
      </div>
    </form>
  );
}
