"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import clsx from "clsx";
import { useProduct, useUpdateURL } from "./product-context";

/**
 * Product gallery: one large square frame with square-cornered arrow controls
 * and a hairline thumbnail rail beneath. Images are cover-cropped so a mixed
 * set of packshots and lifestyle shots still reads as one consistent grid.
 */
export default function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const arrowClass =
    "flex h-12 w-12 items-center justify-center text-ink transition-colors hover:bg-ink hover:text-paper";

  return (
    <form>
      <div className="relative aspect-square w-full overflow-hidden border border-ink/12 bg-paper-100">
        {images[imageIndex] ? (
          <Image
            className="h-full w-full object-cover"
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            src={images[imageIndex]?.src as string}
            alt={images[imageIndex]?.altText as string}
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="eyebrow">No image</span>
          </div>
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-0 right-0 flex divide-x divide-ink/15 border-l border-t border-ink/15 bg-paper">
            <button
              formAction={() => {
                const newState = updateImage(previousImageIndex.toString());
                updateURL(newState);
              }}
              aria-label="Previous product image"
              className={arrowClass}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <button
              formAction={() => {
                const newState = updateImage(nextImageIndex.toString());
                updateURL(newState);
              }}
              aria-label="Next product image"
              className={arrowClass}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {images.length > 1 ? (
          <p className="absolute bottom-4 left-4 font-mono text-spec tracking-micro text-ink">
            {String(imageIndex + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </p>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="mt-4 grid grid-cols-6 gap-2">
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            return (
              <li key={image.src}>
                <button
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateURL(newState);
                  }}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={isActive}
                  className={clsx(
                    "relative block aspect-square w-full overflow-hidden border transition-colors",
                    isActive
                      ? "border-oxblood"
                      : "border-ink/12 hover:border-ink/40"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.altText}
                    fill
                    sizes="12vw"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
