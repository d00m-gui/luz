import { Link, createFileRoute } from "@tanstack/react-router";
import {
  CompressionChart,
  CumulativeAreaChart,
  RunsDistributionChart,
  RunsScatterChart,
  SizesChart,
  TimingChart,
  TokensChart,
} from "../dashboard/charts";
import { getLuzStats } from "../dashboard/stats";
import { config } from "../../luz.config";

export const Route = createFileRoute("/")({
  component: Dashboard,
  loader: () => getLuzStats(),
});

function NavList({ runCount }: { runCount: number }) {
  return (
    <nav>
      <ul className="list">
        <li className="list-title">Main</li>
        <li>
          <a className="list-row sidebar-row solid primary" href="#stats">
            <span aria-hidden="true" />
            <span className="list-col-grow">Resumen</span>
          </a>
        </li>
        <li>
          <a className="list-row sidebar-row" href="#charts">
            <span aria-hidden="true" />
            <span className="list-col-grow">Charts</span>
          </a>
        </li>
        <li>
          <a className="list-row sidebar-row" href="#runs">
            <span aria-hidden="true" />
            <span className="list-col-grow">Corridas</span>
            <span className="badge ghost">{runCount}</span>
          </a>
        </li>
      </ul>
      <ul className="list">
        <li className="list-title">Fixture</li>
        <li>
          <Link to="/about" className="list-row sidebar-row">
            <span aria-hidden="true" />
            <span className="list-col-grow">About</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function Dashboard() {
  const { totals, sizes, runs } = Route.useLoaderData();
  const lastRuns = runs.slice(-8);

  return (
    <div className="dashboard-shell">
      <div
        id="mobile-nav"
        popover="auto"
        className="drawer drawer-nav"
        data-placement="left"
      >
        <div className="panel-header top">
          <span className="panel-header-title">
            <strong>luz</strong>
          </span>
          <button
            className="btn ghost"
            popoverTarget="mobile-nav"
            type="button"
            aria-label="Cerrar menú"
          >
            &times;
          </button>
        </div>
        <NavList runCount={runs.length} />
      </div>

      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <strong style={{ fontSize: "var(--font-size-lg)" }}>luz</strong>
          <span className="stat-label">performance panel</span>
        </div>
        <NavList runCount={runs.length} />
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-hero">
          <div
            className="panel-header top"
            style={{ position: "relative", background: "transparent" }}
          >
            <button
              popoverTarget="mobile-nav"
              className="drawer-trigger panel-shrink"
              type="button"
              aria-label="Abrir menú"
            >
              <span className="drawer-icon">
                <span />
                <span />
                <span />
              </span>
            </button>
            <div className="panel-header-title">
              <h1 style={{ margin: 0 }}>SUMMARY</h1>
              <span className="stat-label">
                <code>@d00m-gui/luz</code> instalado desde tarball, generando{" "}
                <code>src/luz.css</code> con <code>luzVite</code>.
              </span>
            </div>
            <div
              className="panel-shrink"
              style={{ display: "flex", gap: "var(--space-2)" }}
            >
              <Link to="/about" className="btn outline">
                about
              </Link>
              <button className="btn" role="secondary" type="button">
                re-correr
              </button>
            </div>
            <div
              className="panel-shrink"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <span className="avatar sm">CS</span>
              <span className="stat-label">Carlos</span>
            </div>
          </div>
        </div>

        <section id="stats">
          <div
            className="grid"
            style={{ ["--grid-col-size-min" as string]: "12rem" }}
          >
            <div className="stat solid primary stat-gradient">
              <span className="stat-label">tiempo promedio luz()</span>
              <span className="stat-value">{totals.avgMs.toFixed(3)} ms</span>
            </div>
            <div className="stat">
              <span className="stat-label">mejor corrida</span>
              <span className="stat-value">{totals.minMs.toFixed(3)} ms</span>
            </div>
            <div className="stat solid secondary stat-gradient">
              <span className="stat-label">CSS generado</span>
              <span className="stat-value">
                {(totals.cssBytes / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">gzip</span>
              <span className="stat-value">
                {(totals.gzipBytes / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">tokens de color</span>
              <span className="stat-value">{totals.colorTokens}</span>
            </div>
            <div className="stat">
              <span className="stat-label">tokens de tamaño</span>
              <span className="stat-value">{totals.sizeTokens}</span>
            </div>
          </div>
        </section>

        <section id="charts">
          <div
            className="grid"
            style={{ ["--grid-col-size-min" as string]: "18rem" }}
          >
            <div className="card">
              <div className="card-meta">
                <strong>Bytes por sección</strong>
              </div>
              <div className="card-content">
                <SizesChart sizes={sizes} />
              </div>
            </div>
            <div className="card">
              <div className="card-meta">
                <strong>luz() — {runs.length} corridas</strong>
              </div>
              <div className="card-content">
                <TimingChart runs={runs} />
              </div>
            </div>
            <div className="card">
              <div className="card-meta">
                <strong>Área por corrida</strong>
              </div>
              <div className="card-content">
                <CumulativeAreaChart runs={runs} />
              </div>
            </div>
            <div className="card">
              <div className="card-meta">
                <strong>Sobre / bajo promedio</strong>
              </div>
              <div className="card-content">
                <RunsScatterChart runs={runs} avgMs={totals.avgMs} />
              </div>
            </div>
            <div className="card">
              <div className="card-meta">
                <strong>Distribución (cuartiles)</strong>
              </div>
              <div className="card-content">
                <RunsDistributionChart runs={runs} />
              </div>
            </div>
            <div className="card">
              <div className="card-meta">
                <strong>Composición de tokens</strong>
              </div>
              <div className="card-content">
                <TokensChart
                  colorTokens={totals.colorTokens}
                  sizeTokens={totals.sizeTokens}
                />
              </div>
            </div>
            <div className="card">
              <div className="card-meta">
                <strong>Crudo vs gzip</strong>
              </div>
              <div className="card-content">
                <CompressionChart
                  cssBytes={totals.cssBytes}
                  gzipBytes={totals.gzipBytes}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="runs">
          <div className="card">
            <div className="card-meta">
              <strong>Últimas {lastRuns.length} corridas</strong>
            </div>
            <div className="card-content">
              <table>
                <thead>
                  <tr>
                    <th>run #</th>
                    <th>ms</th>
                    <th>estado</th>
                  </tr>
                </thead>
                <tbody>
                  {lastRuns.map((run) => (
                    <tr key={run.run}>
                      <td>{run.run}</td>
                      <td>{run.ms.toFixed(3)}</td>
                      <td>
                        <span
                          className={`badge ${run.ms <= totals.avgMs ? "" : "ghost"}`}
                        >
                          {run.ms <= totals.avgMs ? "ok" : "sobre promedio"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <aside className="dashboard-aside">
        <div className="card">
          <div className="card-meta">
            <strong>Config</strong>
          </div>
          <ul className="list">
            <li className="list-row">
              <span className="list-col-grow">primary</span>
              <span
                className="badge"
                style={{
                  ["--scheme" as string]: config.primary,
                  justifySelf: "end",
                }}
              >
                {config.primary}
              </span>
            </li>
            <li className="list-row">
              <span className="list-col-grow">harmony</span>
              <span className="badge ghost" style={{ justifySelf: "end" }}>
                {config.harmony}
              </span>
            </li>
            <li className="list-row">
              <span className="list-col-grow">mode</span>
              <span className="badge ghost" style={{ justifySelf: "end" }}>
                {config.mode}
              </span>
            </li>
            <li className="list-row">
              <span className="list-col-grow">power</span>
              <span className="badge ghost" style={{ justifySelf: "end" }}>
                {config.power}
              </span>
            </li>
            <li className="list-row">
              <span className="list-col-grow">hues detectados</span>
              <span className="badge" style={{ justifySelf: "end" }}>
                {totals.hues}
              </span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
