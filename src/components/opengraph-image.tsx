import { ImageResponse } from "next/og";
import LogoIcon from "./icons/logo";
import { site } from "@/lib/site";

export type Props = {
  title?: string;
};

/**
 * Social card in the brand's paper-and-oxblood palette. Satori has no access
 * to the site stylesheet, so the palette values are repeated literally here.
 */
export default async function OpengraphImage(
  props?: Props
): Promise<ImageResponse> {
  const { title } = {
    ...{ title: process.env.SITE_NAME || site.name },
    ...props,
  };

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full flex-col justify-between p-20"
        style={{ backgroundColor: "#1C1210" }}
      >
        <div tw="flex items-center">
          <LogoIcon width="52" height="52" fill="#FBF4E6" />
          <p
            tw="ml-5 text-2xl"
            style={{ color: "#C08A4E", letterSpacing: "0.14em" }}
          >
            {site.origin.toUpperCase()} · EST. {site.since}
          </p>
        </div>

        <p
          tw="text-8xl"
          style={{ color: "#FBF4E6", fontFamily: "serif", lineHeight: 1.05 }}
        >
          {title}
        </p>

        <p
          tw="text-2xl"
          style={{ color: "#FBF4E6", opacity: 0.65, letterSpacing: "0.14em" }}
        >
          {site.tagline.toUpperCase()}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
