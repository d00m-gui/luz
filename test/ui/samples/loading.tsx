import { lui } from "../../../dist/react";

export function LoadingSample() {
  return (
    <lui.card>
      <h2>loading</h2>
      <div className="card-content">
        <article aria-busy="true">
          <button aria-busy="true">Please wait…</button>
        </article>
      </div>
    </lui.card>
  );
}
