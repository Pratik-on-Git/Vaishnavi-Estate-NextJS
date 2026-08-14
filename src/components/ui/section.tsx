import clsx from "clsx";

/**
 * Editorial section scaffolding.
 *
 * The reference layouts repeat one structure: a numbered micro-label, a serif
 * headline whose second half is italicised, and a narrow supporting column set
 * to the right. These primitives encode that so sections stay in rhythm.
 */

export function Section({
  className,
  tone = "paper",
  ...props
}: React.ComponentProps<"section"> & { tone?: "paper" | "espresso" | "oxblood" }) {
  return (
    <section
      {...props}
      className={clsx(
        "relative",
        {
          "bg-paper text-ink": tone === "paper",
          "on-dark bg-espresso text-paper": tone === "espresso",
          "on-dark bg-oxblood text-paper": tone === "oxblood",
        },
        className
      )}
    >
      {props.children}
    </section>
  );
}

export function Eyebrow({
  index,
  children,
  inverse,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <p className={clsx(inverse ? "eyebrow-inverse" : "eyebrow", className)}>
      {index ? <span className="mr-3 opacity-60">{index}</span> : null}
      {children}
    </p>
  );
}

/**
 * Serif headline. `accent` renders italic, echoing the "Ignite your *senses*"
 * and "We believe dining *is an art form*" treatment in the references.
 */
export function Headline({
  children,
  accent,
  as: Tag = "h2",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  accent?: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Tag
      className={clsx(
        "font-display font-normal text-balance",
        {
          "text-2xl leading-[1.15] md:text-3xl": size === "sm",
          "text-display-sm": size === "md",
          "text-display-md": size === "lg",
        },
        className
      )}
    >
      {children}
      {accent ? (
        <>
          {" "}
          <em className="italic">{accent}</em>
        </>
      ) : null}
    </Tag>
  );
}

/** Two-column editorial header: headline left, supporting body right. */
export function SectionHeader({
  eyebrow,
  index,
  title,
  accent,
  body,
  action,
  inverse,
  className,
}: {
  eyebrow?: string;
  index?: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  body?: React.ReactNode;
  action?: React.ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("grid gap-8 md:grid-cols-12 md:gap-10", className)}>
      <div className="md:col-span-7">
        {eyebrow ? (
          <Eyebrow index={index} inverse={inverse} className="mb-6">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <Headline accent={accent}>{title}</Headline>
      </div>
      <div className="flex flex-col justify-end gap-6 md:col-span-4 md:col-start-9">
        {body ? (
          <p
            className={clsx(
              "max-w-prose2 text-sm leading-relaxed",
              inverse ? "text-paper/70" : "text-ink-muted"
            )}
          >
            {body}
          </p>
        ) : null}
        {action}
      </div>
    </div>
  );
}
