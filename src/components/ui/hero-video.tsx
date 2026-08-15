"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

/**
 * Decorative background video for the hero.
 *
 * Autoplay only works when the video is both `muted` and `playsInline` — every
 * browser blocks it otherwise, so those are not optional.
 *
 * Two accessibility obligations come with an auto-playing loop, and this
 * component owns both:
 *   - `prefers-reduced-motion: reduce` pauses it, matching the global rule the
 *     rest of the design system already follows for animation.
 *   - WCAG 2.2.2 requires a way to stop motion that runs for more than five
 *     seconds, hence the toggle.
 *
 * The video itself is `aria-hidden`: it carries no information the visually
 * hidden `<h1>` does not already state.
 */
export default function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (media.matches) {
        video.pause();
        setPlaying(false);
      } else {
        // Autoplay can still be refused (low power mode, data saver). Failing
        // to start is not an error worth surfacing — the frame stays put.
        video.play().then(
          () => setPlaying(true),
          () => setPlaying(false)
        );
      }
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        // `metadata` rather than `auto`: the file is several megabytes and must
        // not compete with the product imagery below the fold.
        preload="metadata"
        className={clsx(
          "absolute inset-0 h-full w-full object-cover",
          className
        )}
      />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        className="on-dark absolute bottom-4 right-4 z-10 rounded-full border border-amber px-4 py-1.5 font-mono text-micro uppercase tracking-micro text-amber transition-colors hover:bg-amber hover:text-ink"
      >
        {playing ? "Pause" : "Play"}
        <span className="sr-only"> background video</span>
      </button>
    </>
  );
}
