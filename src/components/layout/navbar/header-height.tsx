"use client";

import { useEffect } from "react";

/**
 * Publishes the real header height to `--header-h`.
 *
 * Two things depend on that number being right: the sticky filter bar on the
 * browse pages, and the sticky sidebar beside the grid. The value declared in
 * `globals.css` is a first-paint estimate only - the announcement strip wraps
 * to two lines on a narrow screen, so the true height differs by breakpoint.
 *
 * This corrects it to the measured pixel after hydration and keeps it correct
 * as the announcement rewraps on rotation or resize.
 */
export default function HeaderHeight() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;

    const publish = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(header.getBoundingClientRect().height)}px`
      );
    };

    publish();

    const observer = new ResizeObserver(publish);
    observer.observe(header);

    // Fonts land after first paint and can change the announcement's line
    // count; the observer catches the resulting resize, but this makes the
    // dependency explicit rather than incidental.
    document.fonts?.ready.then(publish).catch(() => undefined);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-h");
    };
  }, []);

  return null;
}
