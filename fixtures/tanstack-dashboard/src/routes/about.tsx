import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <main className="prose" style={{ padding: "var(--space-8)" }}>
      <h1>about</h1>
      <p>
        Navegada client-side desde <code>/</code> — si{" "}
        <code>virtual:luz.css</code> sigue aplicado acá sin volver a pegarle al
        server, el modo <code>"virtual"</code> sobrevive a la navegación de
        router.
      </p>
      <p>
        <span className="badge">badge</span>{" "}
        <button className="btn" type="button">
          btn
        </button>
      </p>
      <Link to="/" className="btn outline">
        volver
      </Link>
    </main>
  );
}
