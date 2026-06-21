import { lui } from "../../../src/react";
export function BlockquoteSample() {
  return (
    <lui.card>
      <h2>blockquote</h2>
      <div className="card-content">
        <article>
          <blockquote>
            <h3>
              Maecenas vehicula metus tellus, vitae congue turpis hendrerit non. Nam at dui sit amet
              ipsum cursus ornare.
            </h3>
            <cite>&mdash; Phasellus eget lacinia</cite>
          </blockquote>
        </article>
      </div>
    </lui.card>
  );
}
