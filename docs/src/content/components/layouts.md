---
title: Layouts
category: Layout
covers:
  - shell
  - shell-pane
  - shell-body
---

<div class="shell">
  <input type="checkbox" id="ex-shell-toggle" class="drawer-toggle" checked hidden />
  <nav class="drawer-sidebar">
    <div class="list">
      <a class="list-row" aria-current="page">Inicio</a>
      <a class="list-row">Reportes</a>
      <a class="list-row">Ajustes</a>
    </div>
  </nav>
  <div class="shell-pane">
    <div class="panel-header top">
      <label for="ex-shell-toggle" class="drawer-trigger">
        <span class="drawer-icon"><span></span><span></span><span></span></span>
      </label>
      <span class="panel-header-title"><strong>Título</strong></span>
    </div>
    <div class="shell-body">
      <div class="stat">
        <span class="stat-label">contenido</span>
        <span class="stat-value">123</span>
      </div>
      <div class="list">
        <div class="list-row">
          <span class="avatar sm">AB</span>
          <div class="list-col-grow">
            <p><strong>Ada Byron</strong></p>
            <p class="text-sm">Admin</p>
          </div>
          <button class="ghost square" aria-label="More">⋮</button>
        </div>
        <div class="list-row">
          <span class="avatar sm">GH</span>
          <div class="list-col-grow">
            <p><strong>Grace Hopper</strong></p>
            <p class="text-sm">Editor</p>
          </div>
          <button class="ghost square" aria-label="More">⋮</button>
        </div>
      </div>
    </div>
    <div class="panel-header bottom">
      <span class="panel-auto">listo</span>
    </div>
  </div>
</div>

## Dashboard sidebar + titlebar + grilla de stats

<div class="shell" style="height: 24rem;">
  <nav class="drawer-sidebar" style="--drawer-width: 9rem;">
    <div class="list">
      <a class="list-row" aria-current="page">Resumen</a>
      <a class="list-row">Charts</a>
      <a class="list-row">Corridas</a>
      <a class="list-row">Config</a>
    </div>
  </nav>
  <div class="shell-pane">
    <div class="panel-header top">
      <span class="panel-header-title"><strong>Dashboard</strong></span>
      <span class="panel-shrink badge">v1.2</span>
      <span class="panel-shrink avatar sm">CS</span>
    </div>
    <div class="shell-body" style="display: flex; flex-direction: column; gap: var(--space-4);">
      <div class="grid" style="--grid-col-size-min: 8rem;">
        <div class="stat solid primary"><span class="stat-label">ventas</span><span class="stat-value">312</span></div>
        <div class="stat"><span class="stat-label">activos</span><span class="stat-value">48</span></div>
        <div class="stat"><span class="stat-label">errores</span><span class="stat-value">2</span></div>
        <div class="stat"><span class="stat-label">uptime</span><span class="stat-value">99.9%</span></div>
      </div>
      <div class="card">
        <div class="card-meta"><strong>Actividad reciente</strong></div>
        <table>
          <thead><tr><th>evento</th><th>hace</th><th>estado</th></tr></thead>
          <tbody>
            <tr><td>Deploy a producción</td><td>2m</td><td><span class="badge success">ok</span></td></tr>
            <tr><td>Backup nocturno</td><td>1h</td><td><span class="badge success">ok</span></td></tr>
            <tr><td>Rate limit alcanzado</td><td>3h</td><td><span class="badge danger">error</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

## Email 3 columnas (nav + lista + detalle)

<div class="shell" style="height: 16rem;">
  <nav class="shell-pane fixed list" style="--shell-pane-width: 8rem;">
    <a class="list-row" aria-current="page">Recibidos</a>
    <a class="list-row">Enviados</a>
    <a class="list-row">Archivo</a>
  </nav>
  <div class="shell-pane fixed list" style="--shell-pane-width: 14rem;">
    <a class="list-row" aria-current="page">
      <span class="list-col-grow"><strong>Vercel</strong><br /><span class="stat-label">Deploy listo</span></span>
    </a>
    <a class="list-row">
      <span class="list-col-grow">GitHub<br /><span class="stat-label">Nuevo PR</span></span>
    </a>
  </div>
  <div class="shell-pane">
    <div class="shell-body">
      <p><strong>Deploy listo</strong></p>
      <p class="stat-label">El build de producción terminó sin errores.</p>
      <button class="btn outline" type="button">Responder</button>
    </div>
  </div>
</div>

## E-commerce filtros + grilla de productos

<div class="shell" style="height: 18rem;">
  <nav class="shell-pane fixed list" style="--shell-pane-width: 8rem; padding: var(--space-3);">
    <span class="list-title">Categoría</span>
    <label class="list-row"><input type="checkbox" checked /> <span class="list-col-grow">Sillas</span></label>
    <label class="list-row"><input type="checkbox" /> <span class="list-col-grow">Luces</span></label>
  </nav>
  <div class="shell-pane">
    <div class="shell-body">
      <div class="grid" style="--grid-col-size-min: 9rem;">
        <div class="card">
          <div class="card-content">
            <strong>Silla Oslo</strong>
            <span class="stat-label">$120</span>
          </div>
          <div class="card-footer">
            <button class="btn block" type="button">Agregar</button>
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <strong>Lámpara Nix</strong>
            <span class="stat-label">$64</span>
          </div>
          <div class="card-footer">
            <button class="btn block" type="button">Agregar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Landing hero + features + pricing + footer

<div class="shell vertical" style="height: 24rem;">
  <div class="shell-pane">
    <div class="shell-body" style="padding: 0; display: flex; flex-direction: column; gap: var(--space-5);">
      <div class="hero" style="padding-block: var(--space-6);">
        <div class="hero-content">
          <h2 style="margin: 0;">Producto</h2>
          <p class="stat-label">Una línea de bajada corta y directa.</p>
          <div style="display: flex; gap: var(--space-2);">
            <button class="btn" type="button">Empezar</button>
            <button class="btn outline" type="button">Ver demo</button>
          </div>
        </div>
      </div>
      <div style="padding: 0 var(--space-4);">
        <div class="grid" style="--grid-col-size-min: 8rem;">
          <div class="card"><div class="card-content"><strong>Rápido</strong><span class="stat-label">Sin config.</span></div></div>
          <div class="card"><div class="card-content"><strong>Liviano</strong><span class="stat-label">CSS puro.</span></div></div>
          <div class="card"><div class="card-content"><strong>Tipado</strong><span class="stat-label">Tokens con TS.</span></div></div>
        </div>
      </div>
      <div style="padding: 0 var(--space-4);">
        <div class="card solid primary">
          <div class="card-content" style="flex-direction: column;">
            <strong>Pro — $9/mes</strong>
            <span>Todo lo del plan free, sin límites.</span>
          </div>
          <div class="card-footer">
            <button class="btn solid contrast" type="button">Suscribirme</button>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-header bottom">
      <span class="panel-auto stat-label">© luz</span>
    </div>
  </div>
</div>

## Settings nav lateral + secciones de formulario

<div class="shell" style="height: 16rem;">
  <nav class="shell-pane fixed list" style="--shell-pane-width: 8rem;">
    <a class="list-row" aria-current="page">Perfil</a>
    <a class="list-row">Notificaciones</a>
  </nav>
  <div class="shell-pane">
    <form class="shell-body" style="display: flex; flex-direction: column; gap: var(--space-3);">
      <label>Nombre<input type="text" value="Carlos" /></label>
      <label>Email<input type="email" value="carlos@ejemplo.com" /></label>
      <button class="btn" type="submit" style="align-self: start;">Guardar</button>
    </form>
  </div>
</div>

## Chat

<div class="shell vertical" style="height: 22rem;">
  <div class="shell-pane">
    <div class="panel-header top">
      <span class="avatar sm">AI</span>
      <span class="panel-header-title">
        <strong>Asistente</strong>
        <br />
        <span class="stat-label">
          <span class="status" style="color: var(--scheme-success);"></span>
          modelo-mini · en línea
        </span>
      </span>
      <span class="panel-shrink badge ghost">v2</span>
    </div>
    <div class="shell-body" style="display: flex; flex-direction: column; gap: var(--space-3);">
      <div class="card" style="align-self: end; max-width: 75%;">
        <div class="card-content">¿Cómo genero el CSS con luz?</div>
      </div>
      <div style="display: flex; gap: var(--space-2); align-self: start; max-width: 75%;">
        <span class="avatar sm">AI</span>
        <div class="card">
          <div class="card-content">Llamando a <code>luz(config)</code> — devuelve <code>.style</code> listo para escribir a disco.</div>
        </div>
      </div>
      <div style="display: flex; gap: var(--space-2); align-self: start; max-width: 75%;">
        <span class="avatar sm">AI</span>
        <div class="card">
          <div class="card-content" aria-busy="true"></div>
        </div>
      </div>
    </div>
    <form style="display: flex; gap: var(--space-2); padding: var(--space-3); border-top: var(--border-width) solid var(--element-border-color);">
      <input type="text" placeholder="Escribir…" style="flex: 1 1 auto;" />
      <button class="btn" type="submit">Enviar</button>
    </form>
  </div>
</div>
