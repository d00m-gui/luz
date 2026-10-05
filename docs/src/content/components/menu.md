---
title: Menu
category: Overlays
desc: "Oculto (<code>opacity: 0</code>) hasta <code>:popover-open</code>: sin el atributo <code>popover</code> queda en el DOM pero invisible."
covers:
  - menu
  - at-point
  - menu-item
  - menu-label
  - menu-separator
---

<button popovertarget="menu-basic">Options</button>
<div id="menu-basic" popover class="menu">
  <a class="list-row"><i class="icon nf nf-cod-edit_code"></i><span class="list-col-grow">Edit</span></a>
  <a class="list-row"><i class="icon nf nf-oct-duplicate"></i><span class="list-col-grow">Duplicate</span></a>
  <a class="list-row" aria-disabled="true"><i class="icon nf nf-fa-lock"></i><span class="list-col-grow">Facturación</span></a>
  <a class="list-row danger"><i class="icon nf nf-fa-trash_can"></i><span class="list-col-grow">Delete</span><span><kbd>Meta</kbd>+<kbd>D</kbd></span></a>
</div>

## Menu item

<button popovertarget="menu-items">Acciones</button>
<div id="menu-items" popover class="menu">
  <button class="menu-item"><i class="icon nf nf-cod-edit_code"></i> Renombrar <kbd>R</kbd></button>
  <button class="menu-item"><i class="icon nf nf-oct-duplicate"></i> Duplicar <kbd>D</kbd></button>
  <a class="menu-item" href="#"><i class="icon nf nf-fa-external_link"></i> Abrir en pestaña nueva</a>
  <button class="menu-item danger"><i class="icon nf nf-fa-trash_can"></i> Borrar <kbd>⌫</kbd></button>
</div>

## Secciones — <code>.menu-label</code> titula una sección; <code>.menu-separator</code> (o un <code>&lt;hr&gt;</code> suelto dentro del <code>.menu</code>) la separa con un hairline

<button popovertarget="menu-sections">Cuenta</button>
<div id="menu-sections" popover class="menu">
  <div class="menu-label">ada@ejemplo.com</div>
  <button class="menu-item">Perfil</button>
  <button class="menu-item">Ajustes</button>
  <hr class="menu-separator">
  <div class="menu-label">Organización</div>
  <button class="menu-item">Equipo</button>
  <hr>
  <button class="menu-item danger">Salir</button>
</div>

## Menú situado por la aplicación — JS/TS fija <code>--menu-x</code>/<code>--menu-y</code> (viewport) y llama a <code>showPopover()</code>; <code>popover="manual"</code> evita que el light dismiss lo cierre con el mismo clic que abre un menú contextual. <code>--menu-transform-origin</code> cambia el origen de la animación

<div class="menu at-point" popover="manual" style="--menu-x: 120px; --menu-y: 160px">
  <button class="menu-item">Abrir</button>
</div>
