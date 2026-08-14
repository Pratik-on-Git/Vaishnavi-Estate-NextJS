"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow">Something went wrong</p>
      <h2 className="mt-6 font-display text-display-sm">
        The storefront stumbled
      </h2>
      <p className="mt-8 max-w-prose2 text-sm leading-relaxed text-ink-muted">
        This is usually temporary. Try the action again — if it keeps happening,
        write to us and we will look into it.
      </p>
      <button onClick={() => reset()} className="btn-primary mt-10 self-start">
        Try again
      </button>
    </div>
  );
}
