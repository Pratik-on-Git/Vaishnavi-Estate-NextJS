import clsx from "clsx";

export default function Grid(props: React.ComponentProps<"ul">) {
  return (
    <ul
      {...props}
      className={clsx("grid grid-flow-row gap-px bg-ink/12", props.className)}
    >
      {props.children}
    </ul>
  );
}

/**
 * Grid cells no longer force a square. Cards own their own aspect ratio, and
 * the 1px gap over an ink ground gives the hairline-ruled grid of the
 * reference layouts without doubled borders between cells.
 */
function GridItem(props: React.ComponentProps<"li">) {
  return (
    <li {...props} className={clsx("transition-opacity", props.className)}>
      {props.children}
    </li>
  );
}

Grid.Item = GridItem;
