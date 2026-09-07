---
title: Toast
category: Overlays
covers:
  - toast
---

<button popovertarget="toast-bottom-end" class="ghost">bottom-end</button>
<div id="toast-bottom-end" popover class="toast bottom-end"><i class="icon nf nf-fa-bell"></i> Top start toast</div>

<button popovertarget="toast-top-start" class="ghost">top-start</button>
<div id="toast-top-start" popover class="toast top-start"><i class="icon nf nf-fa-bell"></i> Top start toast</div>

<button popovertarget="toast-top-end" class="ghost">top-end</button>
<div id="toast-top-end" popover class="toast top-end"><i class="icon nf nf-fa-bell"></i> Top end toast</div>

<button popovertarget="toast-bottom-start" class="ghost">bottom-start</button>
<div id="toast-bottom-start" popover class="toast bottom-start"><i class="icon nf nf-fa-bell"></i> Bottom start toast</div>

## Feedback

<button popovertarget="toast" class="success">Show toast</button>
<div id="toast" popover class="toast success"><i class="icon nf nf-fa-check_circle"></i> Saved successfully</div>

<button popovertarget="toast-danger" class="danger">Show error toast</button>
<div id="toast-danger" popover class="toast danger"><i class="icon nf nf-fa-times_circle"></i> Something went wrong</div>

<button popovertarget="toast-warning" class="warning">Show warning toast</button>
<div id="toast-warning" popover class="toast warning"><i class="icon nf nf-fa-exclamation_triangle"></i> Check your input</div>

<button popovertarget="toast-info" class="info">Show info toast</button>
<div id="toast-info" popover class="toast info"><i class="icon nf nf-fa-info_circle"></i> New version available</div>

## Contenido

<div>
  <button popovertarget="toast-content">Show toast with content</button>
  <div id="toast-content" popover class="toast toast-card card">
    <div class="card-meta">
      <p><i class="icon nf nf-fa-bell"></i> Hello there</p>
      <div class="space"></div>
      <button popovertarget="toast-content" popovertargetaction="hide" class="ghost square icon">&times;</button>
    </div>
    <div class="card-content">
      <p>The <strong>default</strong> Notification message from <mark>bottom end</mark></p>
      <p>Toasts like this one can carry a full <code>.card</code> layout —
      title, body copy and actions — instead of a single line, useful
      for updates that need a bit more context before they dismiss.</p>
    </div>
    <div class="card-footer">
      <div class="space"></div>
      <button popovertarget="toast-content" popovertargetaction="hide" class="neutral">Hey, there!</button>
    </div>
  </div>
</div>

## Con acciones

<div>
  <button popovertarget="toast-confirm">Show toast with actions</button>
  <div id="toast-confirm" popover class="toast">
    <i class="icon nf nf-fa-bell"></i>
    <span>Delete this file?</span>
    <button popovertarget="toast-confirm" popovertargetaction="hide" class="ghost">Cancelar</button>
    <button popovertarget="toast-confirm" popovertargetaction="hide" class="danger">Eliminar</button>
  </div>
</div>
