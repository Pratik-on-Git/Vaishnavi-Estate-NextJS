"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroVideoClip = {
  src: string;
  poster?: string;
};

/**
 * Decorative background video for the hero. Plays a short playlist of clips
 * on a loop, crossfading between them rather than hard-cutting: each clip
 * plays to its natural end, the next one fades in underneath while it fades
 * out, and the sequence wraps back to the first clip indefinitely.
 *
 * Autoplay only works when the video is both `muted` and `playsInline` — every
 * browser blocks it otherwise, so those are not optional. The native `loop`
 * attribute is deliberately never set: it would suppress the `ended` event
 * this component uses to trigger each crossfade.
 *
 * Two accessibility obligations come with an auto-playing loop, and this
 * component owns both:
 *   - `prefers-reduced-motion: reduce` stops playback entirely — no autoplay,
 *     no crossfade — and simply holds the first clip's opening frame.
 *   - WCAG 2.2.2 requires a way to stop motion that runs for more than five
 *     seconds, hence the visible toggle.
 *
 * Every clip is `aria-hidden`: none carries information the visually hidden
 * `<h1>` elsewhere on the page doesn't already state.
 */
export default function HeroVideo({
  clips,
  className,
}: {
  clips: readonly HeroVideoClip[];
  className?: string;
}) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useRef(false);

  const play = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    // Autoplay can still be refused (low power mode, data saver). Failing to
    // start is not an error worth surfacing — the frame stays put.
    video.play().then(
      () => setPlaying(true),
      () => setPlaying(false)
    );
  }, []);

  // Crossfades from the given clip to the next one in the playlist, wrapping
  // at the end. Takes the outgoing index explicitly rather than reading
  // `activeIndex` from closure, since this fires from each video's own
  // `onEnded` handler and must always advance from *that* clip.
  const advanceFrom = useCallback(
    (index: number) => {
      if (reducedMotion.current) return;
      const next = (index + 1) % clips.length;
      const nextVideo = videoRefs.current[next];
      if (nextVideo) {
        nextVideo.currentTime = 0;
        play(next);
      }
      setActiveIndex(next);
    },
    [clips.length, play]
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      reducedMotion.current = media.matches;
      const current = videoRefs.current[activeIndex];
      if (!current) return;

      if (media.matches) {
        current.pause();
        setPlaying(false);
      } else {
        play(activeIndex);
      }
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
    // Re-checks on every crossfade too, so a mid-loop reduced-motion change
    // (rare, but OS-level settings can flip live) pauses whichever clip is
    // actually on screen rather than a stale one.
  }, [activeIndex, play]);

  const toggle = () => {
    const video = videoRefs.current[activeIndex];
    if (!video) return;

    if (video.paused) {
      play(activeIndex);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      {clips.map((clip, index) => (
        <video
          key={clip.src}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          src={clip.src}
          poster={clip.poster}
          aria-hidden
          muted
          playsInline
          // The clip on screen first needs to be ready immediately; the rest
          // of the playlist only needs to be buffered by the time its turn
          // comes, so it can stay light until then.
          preload={index === 0 ? "auto" : "metadata"}
          onEnded={index === activeIndex ? () => advanceFrom(index) : undefined}
          className={clsx(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            index === activeIndex ? "opacity-100" : "opacity-0",
            className
          )}
        />
      ))}

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
