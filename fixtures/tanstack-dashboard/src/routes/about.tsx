import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <main className="center h-full p-8">
      <div className="card background-raised">
        <div className="card-meta">
          <span className="avatar sm solid primary" aria-hidden="true">
            lz
          </span>
          <strong>luz dashboard</strong>
          <span className="space" />
          <span className="badge ghost pill">fixture</span>
        </div>
        <div className="card-content prose">
          <p>
            This route renders outside the dashboard shell on purpose. Navigated
            client-side from <code>/</code>, it still gets the CSS expanded from{" "}
            <code>@import "@d00m-gui/luz/luz.css"</code> in{" "}
            <code>styles.css</code> without another round-trip: the stylesheet
            belongs to the entry, not to a route.
          </p>
          <p>
            <code>@d00m-gui/luz</code> is installed here from a real tarball (
            <code>bun pm pack</code>), the same path a consumer takes.
          </p>
        </div>
        <div className="card-footer">
          <Link to="/" className="btn">
            Back to overview
          </Link>
          <a
            className="btn ghost"
            href="https://d00m-gui.github.io/luz/"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>
        </div>
      </div>
    </main>
  );
}
