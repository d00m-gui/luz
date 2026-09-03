---
title: Sidebar
category: Layout
covers:
  - drawer-toggle
  - drawer-sidebar
  - list
  - list-row
---
<div style="display: flex; align-items: flex-start">
  <input type="checkbox" id="drawer-sidebar-demo" class="drawer-toggle" checked hidden />
  <nav class="sidebar drawer-sidebar" style="--drawer-width: 12rem">
    <div class="sidebar-scroll">
      <div class="list">
        <a class="list-row" style="--sidebar-bg: var(--primary-400)">Inicio</a>
        <details class="list-row" open>
          <summary>Componentes</summary>
          <div class="list">
            <a class="list-row" style="--sidebar-bg: var(--blue-400)">Button</a>
            <a class="list-row" aria-current="page" style="--sidebar-bg: var(--green-400)">List</a>
            <a class="list-row" style="--sidebar-bg: var(--yellow-400)">Menu</a>
          </div>
        </details>
        <details class="list-row">
          <summary>Layout</summary>
          <div class="list">
            <a class="list-row" style="--sidebar-bg: var(--secondary-400)">Panel header</a>
            <a class="list-row" style="--sidebar-bg: var(--secondary-400)">Drawer</a>
          </div>
        </details>
      </div>
    </div>
  </nav>
  <label for="drawer-sidebar-demo" class="drawer-trigger" aria-label="Toggle sidebar">
    <span class="drawer-icon"><span></span><span></span><span></span></span>
  </label>
</div>
