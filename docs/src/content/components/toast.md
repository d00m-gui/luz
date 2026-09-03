---
title: Toast
category: Overlays
covers:
  - toast
variants:
  - title: Posición
    desc: .top-start / .top-end / .bottom-start
    html: |-
      <button popovertarget="toast-top-start" class="ghost">top-start</button>
      <div id="toast-top-start" popover class="toast top-start"><i class="icon nf nf-fa-bell"></i> Top start toast</div>

      <button popovertarget="toast-top-end" class="ghost">top-end</button>
      <div id="toast-top-end" popover class="toast top-end"><i class="icon nf nf-fa-bell"></i> Top end toast</div>

      <button popovertarget="toast-bottom-start" class="ghost">bottom-start</button>
      <div id="toast-bottom-start" popover class="toast bottom-start"><i class="icon nf nf-fa-bell"></i> Bottom start toast</div>
  - title: Con contenido
    desc: reusa .card-title/.card-footer
    html: |-
      <button popovertarget="toast-content">Show toast with content</button>
      <div id="toast-content" popover class="toast info" style="align-items: flex-start; max-width: 22rem">
        <i class="icon nf nf-fa-info_circle"></i>
        <div>
          <div class="card-title">Update available</div>
          <p>Version 2.4.0 fixes a memory leak and adds dark mode support. Restart to apply.</p>
          <div class="card-footer" style="display: flex; gap: var(--space-3)">
            <button popovertarget="toast-content" popovertargetaction="hide" class="ghost">Later</button>
            <button popovertarget="toast-content" popovertargetaction="hide" class="info">Restart now</button>
          </div>
        </div>
      </div>
  - title: Con acciones
    html: |-
      <button popovertarget="toast-confirm">Show toast with actions</button>
      <div id="toast-confirm" popover class="toast">
        <i class="icon nf nf-fa-bell"></i>
        <span>Delete this file?</span>
        <button popovertarget="toast-confirm" popovertargetaction="hide" class="ghost">Cancelar</button>
        <button popovertarget="toast-confirm" popovertargetaction="hide" class="danger">Eliminar</button>
      </div>
  - title: Stack
    preview: |-
      <div class="preview-frame" style="height: auto; overflow: visible; display: flex; flex-direction: column-reverse; align-items: flex-start; gap: var(--space-3); padding: var(--space-4)">
        <div class="toast success" style="position: static; opacity: 1; transform: none">
          <i class="icon nf nf-fa-check_circle"></i> Saved successfully
        </div>
        <div class="toast" style="position: static; opacity: 0.8; transform: none">
          <i class="icon nf nf-fa-info_circle"></i> Upload complete
        </div>
        <div class="toast" style="position: static; opacity: 0.5; transform: none">
          <i class="icon nf nf-fa-bell"></i> New message
        </div>
      </div>
    html: |-
      <div class="toast success" style="position: static; opacity: 1; transform: none">
        <i class="icon nf nf-fa-check_circle"></i> Saved successfully
      </div>
---
<button popovertarget="toast" class="success">Show toast</button>
<div id="toast" popover class="toast success"><i class="icon nf nf-fa-check_circle"></i> Saved successfully</div>

<button popovertarget="toast-danger" class="danger">Show error toast</button>
<div id="toast-danger" popover class="toast danger"><i class="icon nf nf-fa-times_circle"></i> Something went wrong</div>

<button popovertarget="toast-warning" class="warning">Show warning toast</button>
<div id="toast-warning" popover class="toast warning"><i class="icon nf nf-fa-exclamation_triangle"></i> Check your input</div>

<button popovertarget="toast-info" class="info">Show info toast</button>
<div id="toast-info" popover class="toast info"><i class="icon nf nf-fa-info_circle"></i> New version available</div>
