import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  CompressionChart,
  RunsDistributionChart,
  RunsScatterChart,
  SizesChart,
  TimingChart,
} from "../dashboard/charts";
import { DashboardShell } from "../dashboard/shell";
import { getLuzStats } from "../dashboard/stats";
import { config } from "../../luz.config";

export const Route = createFileRoute("/")({
  component: Dashboard,
  loader: () => getLuzStats(),
});

function ConfigAside({ hues }: { hues: number }) {
  return (
    <div className="card background-raised">
      <div className="card-meta">
        <strong>Config</strong>
        <span className="space" />
        <span className="badge ghost pill">luz.config.ts</span>
      </div>
      <ul className="list">
        <li className="list-row">
          <span className="list-col-grow">primary</span>
          <span className="status primary" aria-hidden="true" />
          <code>{config.primary}</code>
        </li>
        <li className="list-row">
          <span className="list-col-grow">harmony</span>
          <code>{config.harmony}</code>
        </li>
        <li className="list-row">
          <span className="list-col-grow">mode</span>
          <code>{config.mode}</code>
        </li>
        <li className="list-row">
          <span className="list-col-grow">power</span>
          <code>{config.power}</code>
        </li>
        <li className="list-row">
          <span className="list-col-grow">density</span>
          <code>{config.density}</code>
        </li>
        <li className="list-row">
          <span className="list-col-grow">hues</span>
          <span className="badge">{hues}</span>
        </li>
      </ul>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  delta,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: { up: boolean; text: string };
}) {
  return (
    <div className="stat background-raised">
      <span className="stat-label text-muted-foreground">{label}</span>
      <span className="stat-value">
        {value}
        {unit ? <small className="text-muted-foreground"> {unit}</small> : null}
      </span>
      {delta ? (
        <span className={`stat-delta ${delta.up ? "up" : "down"}`}>
          {delta.up ? "▲" : "▼"} {delta.text}
        </span>
      ) : null}
    </div>
  );
}

function Dashboard() {
  const { totals, sizes, runs } = Route.useLoaderData();
  const router = useRouter();
  const lastRuns = runs.slice(-8).reverse();
  const lastRun = runs[runs.length - 1]!;
  const deltaMs = lastRun.ms - totals.avgMs;

  return (
    <DashboardShell
      title="Overview"
      description={
        <>
          <code>luz(config)</code> ran {runs.length} times on the server; this
          page's CSS comes from <code>@import "@d00m-gui/luz/luz.css"</code>.
        </>
      }
      actions={
        <button
          className="btn"
          type="button"
          onClick={() => router.invalidate()}
        >
          Re-run
        </button>
      }
      aside={<ConfigAside hues={totals.hues} />}
    >
      <section id="stats" className="grid xs">
        <Stat
          label="luz() average"
          value={totals.avgMs.toFixed(3)}
          unit="ms"
          delta={{
            up: deltaMs <= 0,
            text: `${Math.abs(deltaMs).toFixed(3)} ms last run`,
          }}
        />
        <Stat label="Best run" value={totals.minMs.toFixed(3)} unit="ms" />
        <Stat
          label="theme CSS"
          value={(totals.cssBytes / 1024).toFixed(1)}
          unit="KB"
        />
        <Stat
          label="gzip"
          value={(totals.gzipBytes / 1024).toFixed(1)}
          unit="KB"
        />
      </section>

      <section id="charts" className="stack">
        <div className="card background-raised">
          <div className="card-meta">
            <strong>luz() per run</strong>
            <span className="space" />
            <span className="badge ghost pill">{runs.length} runs</span>
          </div>
          <div className="card-content">
            <TimingChart runs={runs} />
          </div>
        </div>
        <div className="grid md">
          <div className="card background-raised">
            <div className="card-meta">
              <strong>Above / below average</strong>
            </div>
            <div className="card-content">
              <RunsScatterChart runs={runs} avgMs={totals.avgMs} />
            </div>
          </div>
          <div className="card background-raised">
            <div className="card-meta">
              <strong>Distribution</strong>
            </div>
            <div className="card-content">
              <RunsDistributionChart runs={runs} />
            </div>
          </div>
          <div className="card background-raised">
            <div className="card-meta">
              <strong>Bytes per section</strong>
            </div>
            <div className="card-content">
              <SizesChart sizes={sizes} />
            </div>
          </div>
          <div className="card background-raised">
            <div className="card-meta">
              <strong>Raw vs gzip</strong>
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

      <section id="runs" className="card background-raised">
        <div className="card-meta">
          <strong>Latest runs</strong>
          <span className="space" />
          <span className="badge ghost pill">{runs.length} total</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>run</th>
              <th>ms</th>
              <th>vs average</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {lastRuns.map((run) => {
              const diff = run.ms - totals.avgMs;
              return (
                <tr key={run.run}>
                  <td>
                    <code>#{run.run}</code>
                  </td>
                  <td>{run.ms.toFixed(3)}</td>
                  <td
                    className={diff <= 0 ? "success" : "text-muted-foreground"}
                  >
                    {diff <= 0 ? "−" : "+"}
                    {Math.abs(diff).toFixed(3)}
                  </td>
                  <td>
                    {diff <= 0 ? (
                      <span className="badge">ok</span>
                    ) : (
                      <span className="badge ghost">slow</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </DashboardShell>
  );
}
