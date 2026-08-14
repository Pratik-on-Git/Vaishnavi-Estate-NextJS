import clsx from "clsx";
import { FunctionComponent } from "react";

interface TextProps {
  html: string;
  className?: string;
}

/**
 * Renders Shopify rich text into the estate's type system: serif headings,
 * oxblood links, hairline rules. Kept as `prose` overrides rather than bespoke
 * selectors so merchant-authored HTML stays predictable.
 */
const Prose: FunctionComponent<TextProps> = ({ html, className }) => {
  return (
    <div
      className={clsx(
        "prose max-w-none text-ink-muted",
        "prose-headings:font-display prose-headings:font-normal prose-headings:text-ink",
        "prose-h1:text-display-sm prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl",
        "prose-p:leading-relaxed",
        "prose-a:font-medium prose-a:text-oxblood prose-a:underline prose-a:underline-offset-4 hover:prose-a:opacity-70",
        "prose-strong:font-semibold prose-strong:text-ink",
        "prose-blockquote:border-l prose-blockquote:border-oxblood prose-blockquote:pl-6 prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:italic prose-blockquote:text-ink",
        "prose-hr:border-ink/15",
        "prose-li:marker:text-ink-faint",
        "prose-img:border prose-img:border-ink/12",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html as string }}
    />
  );
};

export default Prose;
