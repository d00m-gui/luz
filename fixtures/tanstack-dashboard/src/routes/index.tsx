import { Link, createFileRoute } from '@tanstack/react-router'
import { SizesChart, TimingChart } from '../dashboard/charts'
import { getLuzStats } from '../dashboard/stats'

export const Route = createFileRoute('/')({
  component: Dashboard,
  loader: () => getLuzStats(),
})

function Dashboard() {
  const { totals, sizes, runs } = Route.useLoaderData()

  return (
    <main style={{ maxWidth: '72rem', margin: '0 auto', padding: 'var(--space-8)' }}>
      <h1>luz — panel de performance</h1>
      <p>
        <Link to="/about" className="btn outline">
          about
        </Link>
      </p>
      <p style={{ color: 'var(--on-element-placeholder)' }}>
        Consumiendo <code>@d00m-gui/luz</code> instalado desde tarball
        (<code>bun pack</code>) dentro de una app TanStack Start real, con{' '}
        <code>luzVite</code> generando <code>src/luz.css</code> y{' '}
        <code>@tanstack/charts</code> graficando stats de la corrida server-side.
      </p>

      <div className="grid">
        <div className="stat">
          <span className="stat-label">tiempo promedio luz()</span>
          <span className="stat-value">{totals.avgMs.toFixed(3)} ms</span>
        </div>
        <div className="stat">
          <span className="stat-label">mejor corrida</span>
          <span className="stat-value">{totals.minMs.toFixed(3)} ms</span>
        </div>
        <div className="stat">
          <span className="stat-label">CSS generado</span>
          <span className="stat-value">{(totals.cssBytes / 1024).toFixed(1)} KB</span>
        </div>
        <div className="stat">
          <span className="stat-label">gzip</span>
          <span className="stat-value">{(totals.gzipBytes / 1024).toFixed(1)} KB</span>
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

      <div className="grid" style={{ marginTop: 'var(--space-8)' }}>
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
      </div>
    </main>
  )
}
