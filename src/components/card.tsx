/** Styled `<article>` container with luz's `"card"` style injected. Accepts any `<article>` prop. */
export function Card(props: React.ComponentProps<"article">): React.ReactNode {
  return <article className="card" {...props} />;
}
