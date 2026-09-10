---
title: Drawer
category: Overlays
covers:
  - drawer
  - drawer-trigger
  - drawer-icon
  - radial-trigger
  - radial-menu
  - radial-item
  - fixed
---

<div class="element row">
  <div id="drawer-demo" popover class="drawer" data-placement="left">
    <div>
      <div class="panel-header top">
        <span class="panel-header-title"><strong>Menu</strong></span>
        <button class="ghost" popovertarget="drawer-demo">&times;</button>
      </div>
      <div class="list">
        <a class="list-row">Inicio</a>
        <a class="list-row">Componentes</a>
        <a class="list-row">Docs</a>
      </div>
    </div>
  </div>
  <button popovertarget="drawer-demo" aria-label="Abrir menú">
    <span>Menu</span>
  </button>
  <div id="drawer-fullscreen" popover class="drawer fluid" data-placement="fullscreen">
    <div class="panel-header top">
      <span class="panel-header-title"><strong>Explorar</strong></span>
      <button class="ghost" popovertarget="drawer-fullscreen">&times;</button>
    </div>
    <div class="join vertical">
      <button class="h2" popovertarget="drawer-fullscreen">Inicio</button>
      <button class="h2" popovertarget="drawer-fullscreen">Componentes</button>
      <button class="h2" popovertarget="drawer-fullscreen">Docs</button>
      <button class="h2" popovertarget="drawer-fullscreen">Contacto</button>
    </div>
  </div>
  <button popovertarget="drawer-fullscreen" aria-label="Abrir menú de pantalla completa">
    <span>Fullscreen</span>
  </button>
  <div id="radial-demo" popover class="radial-menu">
    <button popovertarget="radial-demo" popovertargetaction="hide" class="radial-item" style="--radial-angle: -150deg;">
      <i class="icon nf nf-fa-pencil"></i><span>Editar</span>
    </button>
    <button popovertarget="radial-demo" popovertargetaction="hide" class="radial-item" style="--radial-angle: -90deg;">
      <i class="icon nf nf-fa-share_alt"></i><span>Compartir</span>
    </button>
    <button popovertarget="radial-demo" popovertargetaction="hide" class="radial-item" style="--radial-angle: -30deg;">
      <i class="icon nf nf-fa-trash_can"></i><span>Borrar</span>
    </button>
  </div>
  <button popovertarget="radial-demo" class="radial-trigger" aria-label="Abrir acciones">
    <i class="icon nf nf-fa-plus"></i>
  </button>
</div>

## FAB

<div id="radial-fab" popover class="radial-menu fixed">
  <button popovertarget="radial-fab" popovertargetaction="hide" class="radial-item" style="--radial-angle: -150deg;">
    <i class="icon nf nf-fa-pencil"></i><span>Nota</span>
  </button>
  <button popovertarget="radial-fab" popovertargetaction="hide" class="radial-item" style="--radial-angle: -90deg;">
    <i class="icon nf nf-fa-camera"></i><span>Foto</span>
  </button>
</div>
<button popovertarget="radial-fab" class="radial-trigger fixed primary" aria-label="Crear">
  <i class="icon nf nf-fa-plus"></i>
</button>
<!--preview-->
<div class="demo-fab">
  <div id="radial-fab" popover class="radial-menu fixed">
    <button popovertarget="radial-fab" popovertargetaction="hide" class="radial-item" style="--radial-angle: -150deg;">
      <i class="icon nf nf-fa-pencil"></i><span>Nota</span>
    </button>
    <button popovertarget="radial-fab" popovertargetaction="hide" class="radial-item" style="--radial-angle: -90deg;">
      <i class="icon nf nf-fa-camera"></i><span>Foto</span>
    </button>
  </div>
  <button popovertarget="radial-fab" class="radial-trigger fixed primary" aria-label="Crear">
    <i class="icon nf nf-fa-plus"></i>
  </button>
</div>
<style>
  .demo-fab {
    position: relative;
    height: 12rem;
    contain: paint;
    border: var(--border-width) dashed var(--element-border-color);
    border-radius: var(--border-radius);
  }
</style>
<!--/preview-->
