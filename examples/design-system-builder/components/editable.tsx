import { memo, useRef } from "react";
import type { JSX } from "react";

/**
 * Turns any piece of static copy on the page into an in-place editable
 * field, so the whole document can double as a style guide you type into
 * directly — no separate WYSIWYG library.
 *
 * `contentEditable` + React is a known trap: if the element's children stay
 * bound to state, every keystroke's re-render resets the browser's own
 * caret to the start (typed text comes out reversed). The fix isn't a rich
 * text engine, it's the opposite — go fully uncontrolled. This component
 * takes no reactive props (`as`/`className`/`defaultText` are only read
 * once, `onChange` is expected to be a stable identity like a `useState`
 * setter) and is wrapped in `memo`, so React never touches its DOM after
 * mount; edits are read from the DOM via a ref and reported upward instead
 * of round-tripping through `children`. Same pattern as `EditableTitle`.
 */
export const Editable = memo(function Editable({
  as: Tag = "span",
  className,
  style,
  defaultText,
  onChange,
}: {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  defaultText: string;
  onChange?: (value: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  return (
    <Tag
      ref={ref as never}
      className={`editable${className ? ` ${className}` : ""}`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onInput={() => onChange?.(ref.current?.textContent ?? "")}
    >
      {defaultText}
    </Tag>
  );
});
