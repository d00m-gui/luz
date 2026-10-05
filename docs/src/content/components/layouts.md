---
title: Layouts
category: Layout
desc: "<code>.shell</code> reparte la pantalla en panes (<code>.shell-pane</code>, <code>.fixed</code> para los laterales) y pone un hairline entre hijos directos; <code>.shell-body</code> es la zona que scrollea, con padding propio."
covers:
  - shell
  - shell-pane
  - shell-body
  - fixed
  - vertical
  - app
  - responsive
  - clip
---

<div class="shell" style="--shell-height: 30rem;">
  <input type="checkbox" id="ex-shell-toggle" class="drawer-toggle" checked hidden />
  <nav class="drawer-sidebar" style="--drawer-width: 12rem;">
    <div class="list">
      <span class="list-title">Workspace</span>
      <a class="list-row" aria-current="page"><i class="icon nf nf-cod-home"></i><span class="list-col-grow">Inicio</span></a>
      <a class="list-row"><i class="icon nf nf-cod-graph"></i><span class="list-col-grow">Reportes</span></a>
      <a class="list-row"><i class="icon nf nf-cod-organization"></i><span class="list-col-grow">Equipo</span><span class="badge sm">4</span></a>
      <a class="list-row"><i class="icon nf nf-cod-settings_gear"></i><span class="list-col-grow">Ajustes</span></a>
    </div>
  </nav>
  <div class="shell-pane">
    <div class="panel-header top">
      <label for="ex-shell-toggle" class="drawer-trigger">
        <span class="drawer-icon"><span></span><span></span><span></span></span>
      </label>
      <span class="panel-header-title"><strong>Equipo</strong></span>
      <button class="btn sm ghost" type="button"><i class="icon nf nf-cod-search"></i></button>
      <button class="btn sm primary" type="button"><i class="icon nf nf-cod-add"></i> Invitar</button>
    </div>
    <div class="shell-body stack">
      <div class="grid xs">
        <div class="stat"><span class="stat-label">miembros</span><span class="stat-value">12</span></div>
        <div class="stat"><span class="stat-label">invitaciones</span><span class="stat-value">3</span></div>
      </div>
      <div class="list">
        <div class="list-row">
          <span class="avatar sm">AB</span>
          <div class="list-col-grow">
            <p><strong>Ada Byron</strong></p>
            <p class="demo-muted">ada@ejemplo.com</p>
          </div>
          <span class="badge solid">Admin</span>
          <button class="ghost square" type="button" aria-label="Más">⋮</button>
        </div>
        <div class="list-row">
          <span class="avatar sm">GH</span>
          <div class="list-col-grow">
            <p><strong>Grace Hopper</strong></p>
            <p class="demo-muted">grace@ejemplo.com</p>
          </div>
          <span class="badge">Editor</span>
          <button class="ghost square" type="button" aria-label="Más">⋮</button>
        </div>
        <div class="list-row">
          <span class="avatar sm">KJ</span>
          <div class="list-col-grow">
            <p><strong>Katherine Johnson</strong></p>
            <p class="demo-muted">katherine@ejemplo.com</p>
          </div>
          <span class="badge outline warning">Pendiente</span>
          <button class="ghost square" type="button" aria-label="Más">⋮</button>
        </div>
      </div>
    </div>
    <div class="toolbar bottom">
      <div class="toolbar-group"><span class="status success"></span> Sincronizado</div>
      <div class="toolbar-group end">12 miembros</div>
    </div>
  </div>
</div>

## App — <code>.shell.app</code> ocupa toda la altura del contenedor, sin borde ni radio; el contenido va en un <code>.page</code>

<div class="demo-shell-app">
  <div class="shell app">
    <nav class="shell-pane fixed" style="--shell-pane-width: 12rem;">
      <div class="list nav">
        <a class="list-row" aria-current="page"><i class="icon nf nf-cod-home"></i><span class="list-col-grow">Resumen</span></a>
        <a class="list-row"><i class="icon nf nf-cod-rocket"></i><span class="list-col-grow">Deploys</span><span class="badge sm">12</span></a>
        <a class="list-row"><i class="icon nf nf-cod-bell"></i><span class="list-col-grow">Alertas</span><span class="status danger"></span></a>
        <a class="list-row"><i class="icon nf nf-cod-settings_gear"></i><span class="list-col-grow">Ajustes</span></a>
      </div>
    </nav>
    <div class="shell-pane">
      <div class="panel-header top">
        <span class="panel-header-title"><strong>Resumen</strong></span>
        <span class="panel-shrink avatar sm">CS</span>
      </div>
      <div class="shell-body">
        <div class="page">
          <header class="page-header">
            <div class="page-header-title">
              <h1>Hola, Carlos</h1>
              <p>Un vistazo a la semana: 12 deploys, ningún incidente abierto.</p>
            </div>
            <button class="btn primary" type="button"><i class="icon nf nf-cod-rocket"></i> Nuevo deploy</button>
          </header>
          <div class="grid xs">
            <div class="stat"><span class="stat-label">deploys</span><span class="stat-value">12</span><span class="stat-delta">▲ 3</span></div>
            <div class="stat"><span class="stat-label">errores</span><span class="stat-value">0</span></div>
            <div class="stat"><span class="stat-label">p95</span><span class="stat-value">182 ms</span></div>
          </div>
          <div class="card">
            <div class="card-meta"><strong>Últimos deploys</strong></div>
            <table>
              <thead><tr><th>rama</th><th>autor</th><th>hace</th><th>estado</th></tr></thead>
              <tbody>
                <tr><td>main</td><td>Ada</td><td>2m</td><td><span class="badge success">ok</span></td></tr>
                <tr><td>feat/billing</td><td>Grace</td><td>1h</td><td><span class="badge info">preview</span></td></tr>
                <tr><td>fix/login</td><td>Katherine</td><td>3h</td><td><span class="badge success">ok</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Responsive — <code>.shell.responsive</code> apila los panes bajo 48rem y el hairline pasa a horizontal

<div class="shell responsive" style="--shell-height: 18rem;">
  <nav class="shell-pane fixed" style="--shell-pane-width: 11rem;">
    <div class="list">
      <a class="list-row" aria-current="page"><i class="icon nf nf-cod-inbox"></i><span class="list-col-grow">Recibidos</span><span class="badge sm">8</span></a>
      <a class="list-row"><i class="icon nf nf-cod-send"></i><span class="list-col-grow">Enviados</span></a>
      <a class="list-row"><i class="icon nf nf-cod-archive"></i><span class="list-col-grow">Archivo</span></a>
    </div>
  </nav>
  <div class="shell-pane">
    <div class="shell-body stack">
      <h4>Angostá la ventana</h4>
      <p>Por debajo de 48rem la barra lateral pasa arriba del contenido y el separador vertical se vuelve horizontal, sin media queries propias.</p>
      <p class="demo-muted">El ancho del pane fijo deja de aplicar: en columna, cada pane toma el ancho completo.</p>
    </div>
  </div>
</div>

## Dashboard

<div class="shell" style="--shell-height: 28rem;">
  <nav class="drawer-sidebar" style="--drawer-width: 11rem;">
    <div class="list">
      <span class="list-title">Panel</span>
      <a class="list-row" aria-current="page"><i class="icon nf nf-cod-home"></i><span class="list-col-grow">Resumen</span></a>
      <a class="list-row"><i class="icon nf nf-cod-graph"></i><span class="list-col-grow">Métricas</span></a>
      <a class="list-row"><i class="icon nf nf-cod-pulse"></i><span class="list-col-grow">Corridas</span></a>
      <a class="list-row"><i class="icon nf nf-cod-settings_gear"></i><span class="list-col-grow">Config</span></a>
    </div>
  </nav>
  <div class="shell-pane">
    <div class="panel-header top">
      <span class="panel-header-title"><strong>Dashboard</strong></span>
      <span class="panel-shrink badge">v1.2</span>
      <span class="panel-shrink avatar sm">CS</span>
    </div>
    <div class="shell-body stack">
      <div class="grid xs">
        <div class="stat solid primary"><span class="stat-label">ventas</span><span class="stat-value">312</span><span class="stat-delta">▲ 12%</span></div>
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
            <tr><td>Certificado renovado</td><td>1d</td><td><span class="badge neutral">info</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

## Email — tres panes: carpetas y lista fijos, lectura flexible

<div class="shell" style="--shell-height: 22rem;">
  <nav class="shell-pane fixed" style="--shell-pane-width: 10rem;">
    <div class="list">
      <a class="list-row" aria-current="page"><i class="icon nf nf-cod-inbox"></i><span class="list-col-grow">Recibidos</span><span class="badge sm">3</span></a>
      <a class="list-row"><i class="icon nf nf-cod-star_full"></i><span class="list-col-grow">Destacados</span></a>
      <a class="list-row"><i class="icon nf nf-cod-send"></i><span class="list-col-grow">Enviados</span></a>
      <a class="list-row"><i class="icon nf nf-cod-archive"></i><span class="list-col-grow">Archivo</span></a>
    </div>
  </nav>
  <div class="shell-pane fixed" style="--shell-pane-width: 16rem;">
    <div class="list">
      <a class="list-row" aria-current="page">
        <div class="list-col-grow">
          <p><strong>Vercel</strong></p>
          <p>Deploy listo</p>
          <p class="demo-muted">El build de producción terminó…</p>
        </div>
        <small class="demo-muted">9:41</small>
      </a>
      <a class="list-row">
        <div class="list-col-grow">
          <p><strong>GitHub</strong></p>
          <p>Nuevo PR en luz</p>
          <p class="demo-muted">feat: @layer luz para todo…</p>
        </div>
        <small class="demo-muted">ayer</small>
      </a>
      <a class="list-row">
        <div class="list-col-grow">
          <p><strong>Ada Byron</strong></p>
          <p>Revisión del diseño</p>
          <p class="demo-muted">Te dejé comentarios en…</p>
        </div>
        <small class="demo-muted">lun</small>
      </a>
    </div>
  </div>
  <div class="shell-pane">
    <div class="panel-header top">
      <span class="panel-header-title"><strong>Deploy listo</strong></span>
      <button class="btn sm ghost" type="button" aria-label="Archivar"><i class="icon nf nf-cod-archive"></i></button>
      <button class="btn sm ghost" type="button" aria-label="Borrar"><i class="icon nf nf-cod-trash"></i></button>
    </div>
    <div class="shell-body stack">
      <div class="list-row">
        <span class="avatar sm">V</span>
        <div class="list-col-grow">
          <p><strong>Vercel</strong></p>
          <p class="demo-muted">para carlos@ejemplo.com · 9:41</p>
        </div>
      </div>
      <p>El build de producción de <code>luz-docs</code> terminó sin errores en 42 s. La versión ya está publicada y el dominio apunta al nuevo deploy.</p>
      <p class="demo-muted">Si algo no anda, podés volver al deploy anterior desde el panel.</p>
      <div>
        <button class="btn primary" type="button"><i class="icon nf nf-cod-reply"></i> Responder</button>
      </div>
    </div>
  </div>
</div>

## E-commerce

<div class="shell" style="--shell-height: 24rem;">
  <nav class="shell-pane fixed" style="--shell-pane-width: 11rem;">
    <div class="shell-body stack">
      <div class="list">
        <span class="list-title">Categoría</span>
        <label class="list-row"><input type="checkbox" checked /><span class="list-col-grow">Sillas</span></label>
        <label class="list-row"><input type="checkbox" checked /><span class="list-col-grow">Mesas</span></label>
        <label class="list-row"><input type="checkbox" /><span class="list-col-grow">Luces</span></label>
      </div>
      <label class="field">
        <span>Precio máximo</span>
        <input type="range" min="0" max="500" value="300" />
      </label>
    </div>
  </nav>
  <div class="shell-pane">
    <div class="panel-header top">
      <span class="panel-header-title"><strong>12 productos</strong></span>
      <button class="btn sm ghost" type="button"><i class="icon nf nf-fa-shopping_cart"></i> 2</button>
    </div>
    <div class="shell-body">
      <div class="grid xs">
        <div class="card">
          <div class="card-cover demo-cover" style="--demo-hue: 40"></div>
          <div class="card-content">
            <strong>Silla Oslo</strong>
            <span class="demo-muted">Roble y lana</span>
          </div>
          <div class="card-footer">
            <strong>$120</strong>
            <div class="space"></div>
            <button class="btn sm primary" type="button"><i class="icon nf nf-fa-cart_plus"></i> Agregar</button>
          </div>
        </div>
        <div class="card">
          <div class="card-cover demo-cover" style="--demo-hue: 200"></div>
          <div class="card-content">
            <strong>Mesa Fjord</strong>
            <span class="demo-muted">Fresno, 160 cm</span>
          </div>
          <div class="card-footer">
            <strong>$340</strong>
            <span class="badge sm success">nuevo</span>
            <div class="space"></div>
            <button class="btn sm primary" type="button"><i class="icon nf nf-fa-cart_plus"></i> Agregar</button>
          </div>
        </div>
        <div class="card">
          <div class="card-cover demo-cover" style="--demo-hue: 300"></div>
          <div class="card-content">
            <strong>Lámpara Nix</strong>
            <span class="demo-muted">Vidrio soplado</span>
          </div>
          <div class="card-footer">
            <strong>$64</strong>
            <div class="space"></div>
            <button class="btn sm" type="button" disabled>Agotado</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Landing — <code>.shell.vertical</code>: hero, beneficios, precio y pie apilados

<div class="shell vertical" style="--shell-height: 34rem;">
  <div class="panel-header top">
    <span class="panel-header-title"><strong>luz</strong></span>
    <a href="#">Docs</a>
    <a href="#">Precios</a>
    <button class="btn sm primary" type="button">Empezar</button>
  </div>
  <div class="shell-pane">
    <div class="shell-body stack" style="--stack-gap: var(--space-8);">
      <div class="hero compact" style="flex-shrink: 0;">
        <div class="hero-content stack">
          <span class="badge">v0.5</span>
          <h2>Diseño desde un solo color</h2>
          <p class="demo-muted">Paleta, tipografía y componentes en CSS puro, generados desde tu config.</p>
          <div>
            <button class="btn primary lg" type="button">Empezar</button>
            <button class="btn outline lg" type="button">Ver demo</button>
          </div>
        </div>
      </div>
      <div class="grid xs">
        <div class="card"><div class="card-content"><i class="icon nf nf-fa-bolt"></i><strong>Rápido</strong><span class="demo-muted">Sin runtime: el CSS sale en el build.</span></div></div>
        <div class="card"><div class="card-content"><i class="icon nf nf-fa-feather"></i><strong>Liviano</strong><span class="demo-muted">Un archivo por componente, importás lo que usás.</span></div></div>
        <div class="card"><div class="card-content"><i class="icon nf nf-fa-code"></i><strong>Tipado</strong><span class="demo-muted">Config y tokens con TypeScript.</span></div></div>
      </div>
      <div class="card solid primary">
        <div class="card-content">
          <strong>Pro — $9/mes</strong>
          <span>Todo lo del plan free, sin límites de proyectos.</span>
        </div>
        <div class="card-footer">
          <button class="btn solid contrast" type="button">Suscribirme</button>
        </div>
      </div>
    </div>
  </div>
  <div class="toolbar bottom">
    <div class="toolbar-group">© luz</div>
    <div class="toolbar-group end"><a href="#">GitHub</a><a href="#">Licencia</a></div>
  </div>
</div>

## Settings — formulario con <code>.field</code> y acciones al pie

<div class="shell" style="--shell-height: 30rem;">
  <nav class="shell-pane fixed" style="--shell-pane-width: 11rem;">
    <div class="list">
      <a class="list-row" aria-current="page"><i class="icon nf nf-cod-account"></i><span class="list-col-grow">Perfil</span></a>
      <a class="list-row"><i class="icon nf nf-cod-bell"></i><span class="list-col-grow">Notificaciones</span></a>
      <a class="list-row"><i class="icon nf nf-cod-shield"></i><span class="list-col-grow">Seguridad</span></a>
    </div>
  </nav>
  <form class="shell-pane">
    <div class="panel-header top">
      <span class="panel-header-title"><strong>Perfil</strong></span>
    </div>
    <div class="shell-body stack">
      <label class="field">
        <span>Nombre</span>
        <input type="text" value="Carlos" />
      </label>
      <label class="field">
        <span>Email</span>
        <input type="email" value="carlos@ejemplo.com" />
        <small class="field-hint">Lo usamos para avisos de cuenta.</small>
      </label>
      <label class="field">
        <span>Zona horaria</span>
        <select>
          <option>America/Santiago</option>
          <option>America/Buenos_Aires</option>
        </select>
      </label>
      <label class="field row">
        <input type="checkbox" role="switch" checked />
        <span>Resumen semanal por email</span>
      </label>
    </div>
    <div class="toolbar bottom">
      <div class="toolbar-group end">
        <button class="btn ghost" type="reset">Cancelar</button>
        <button class="btn primary" type="submit">Guardar</button>
      </div>
    </div>
  </form>
</div>

## Chat

<div class="shell vertical" style="--shell-height: 26rem;">
  <div class="panel-header top">
    <span class="avatar sm">AI</span>
    <span class="panel-header-title">
      <strong>Asistente</strong>
      <br />
      <small class="demo-muted"><span class="status success"></span> modelo-mini · en línea</small>
    </span>
    <span class="panel-shrink badge ghost">v2</span>
  </div>
  <div class="shell-body stack">
    <div class="card demo-bubble mine">
      <div class="card-content"><p>¿Cómo genero el CSS con luz?</p></div>
    </div>
    <div class="demo-bubble-row">
      <span class="avatar sm">AI</span>
      <div class="card demo-bubble">
        <div class="card-content"><p>Con el plugin de Vite o Astro: importás <code>@d00m-gui/luz/luz.css</code> y el plugin genera el tema desde tu config.</p></div>
      </div>
    </div>
    <div class="card demo-bubble mine">
      <div class="card-content"><p>¿Y si solo quiero los botones?</p></div>
    </div>
    <div class="demo-bubble-row">
      <span class="avatar sm">AI</span>
      <div class="card demo-bubble">
        <div class="card-content" aria-busy="true"></div>
      </div>
    </div>
  </div>
  <form class="toolbar bottom" style="flex-direction: row;">
    <input type="text" placeholder="Escribir…" style="flex: 1 1 auto; min-width: 0;" />
    <button class="btn primary" type="submit"><i class="icon nf nf-cod-send"></i> Enviar</button>
  </form>
</div>

## Pane que no scrollea — <code>.shell-pane.clip</code> usa <code>overflow: clip</code>: en un pane-lienzo las capas que salen del borde se recortan sin volverlo scrolleable (ni por teclado ni por <code>scrollIntoView</code>)

<div class="shell" style="--shell-height: 18rem;">
  <div class="shell-pane fixed" style="--shell-pane-width: 10rem;">
    <div class="list">
      <span class="list-title">Capas</span>
      <a class="list-row" aria-current="page"><i class="icon nf nf-cod-layers"></i><span class="list-col-grow">Tarjeta</span></a>
      <a class="list-row"><i class="icon nf nf-cod-symbol_color"></i><span class="list-col-grow">Fondo</span></a>
    </div>
  </div>
  <div class="shell-pane clip demo-canvas">
    <div class="toolbar vertical floating demo-float-tools">
      <div class="toolbar-group">
        <button class="btn sm ghost" type="button" aria-label="Seleccionar"><i class="icon nf nf-fa-mouse_pointer"></i></button>
        <button class="btn sm ghost" type="button" aria-label="Mover"><i class="icon nf nf-cod-move"></i></button>
      </div>
      <div class="toolbar-group">
        <button class="btn sm ghost" type="button" aria-label="Zoom"><i class="icon nf nf-cod-zoom_in"></i></button>
      </div>
    </div>
    <div class="card demo-float-card">
      <div class="card-meta"><strong>Tarjeta arrastrada</strong></div>
      <div class="card-content"><p>Sale por el borde derecho y se recorta; el pane no gana scroll.</p></div>
    </div>
  </div>
</div>

<style>
  .demo-muted {
    color: var(--on-element-placeholder);
  }
  .demo-shell-app {
    height: 30rem;
    border: var(--border-width) dashed var(--element-border-color);
  }
  .demo-cover {
    --ratio: 16 / 9;
    background: linear-gradient(
      135deg,
      oklch(0.7 0.12 var(--demo-hue)),
      oklch(0.45 0.1 calc(var(--demo-hue) + 40))
    );
  }
  .demo-bubble {
    max-width: 75%;
    &.mine {
      align-self: end;
    }
  }
  .demo-bubble-row {
    display: flex;
    gap: var(--space-2);
    align-items: flex-start;
  }
  .demo-canvas {
    position: relative;
    background-image: radial-gradient(
      var(--element-border-color) 1px,
      transparent 1px
    );
    background-size: var(--space-6) var(--space-6);
  }
  .demo-float-tools {
    position: absolute;
    inset-block-start: var(--space-4);
    inset-inline-start: var(--space-4);
  }
  .demo-float-card {
    position: absolute;
    inset-block-start: var(--space-12);
    inset-inline-end: calc(var(--space-16) * -1);
    width: 18rem;
  }
</style>
