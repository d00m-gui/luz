---
title: Notice
category: Overlays
covers:
  - notice
---

<button popovertarget="notice-bottom-end" class="ghost">bottom-end</button>
<div id="notice-bottom-end" popover class="notice bottom-end"><i class="icon nf nf-fa-bell"></i> Top start notice</div>

<button popovertarget="notice-top-start" class="ghost">top-start</button>
<div id="notice-top-start" popover class="notice top-start"><i class="icon nf nf-fa-bell"></i> Top start notice</div>

<button popovertarget="notice-top-end" class="ghost">top-end</button>
<div id="notice-top-end" popover class="notice top-end"><i class="icon nf nf-fa-bell"></i> Top end notice</div>

<button popovertarget="notice-bottom-start" class="ghost">bottom-start</button>
<div id="notice-bottom-start" popover class="notice bottom-start"><i class="icon nf nf-fa-bell"></i> Bottom start notice</div>

## Feedback

<button popovertarget="notice" class="success">Show notice</button>
<div id="notice" popover class="notice success"><i class="icon nf nf-fa-check_circle"></i> Saved successfully</div>

<button popovertarget="notice-danger" class="danger">Show error notice</button>
<div id="notice-danger" popover class="notice danger"><i class="icon nf nf-fa-times_circle"></i> Something went wrong</div>

<button popovertarget="notice-warning" class="warning">Show warning notice</button>
<div id="notice-warning" popover class="notice warning"><i class="icon nf nf-fa-exclamation_triangle"></i> Check your input</div>

<button popovertarget="notice-info" class="info">Show info notice</button>
<div id="notice-info" popover class="notice info"><i class="icon nf nf-fa-info_circle"></i> New version available</div>

## Contenido

<div>
  <button popovertarget="notice-content">Show notice with content</button>
  <div id="notice-content" popover class="notice notice-card card">
    <div class="card-meta">
      <p><i class="icon nf nf-fa-bell"></i> Hello there</p>
      <div class="space"></div>
      <button popovertarget="notice-content" popovertargetaction="hide" class="ghost square icon">&times;</button>
    </div>
    <div class="card-content">
      <p>The <strong>default</strong> Notification message from <mark>bottom end</mark></p>
      <p>Notices like this one can carry a full <code>.card</code> layout —
      title, body copy and actions — instead of a single line, useful
      for updates that need a bit more context before they dismiss.</p>
    </div>
    <div class="card-footer">
      <div class="space"></div>
      <button popovertarget="notice-content" popovertargetaction="hide" class="neutral">Hey, there!</button>
    </div>
  </div>
</div>

## Con acciones

<div>
  <button popovertarget="notice-confirm">Show notice with actions</button>
  <div id="notice-confirm" popover class="notice">
    <i class="icon nf nf-fa-bell"></i>
    <span>Delete this file?</span>
    <button popovertarget="notice-confirm" popovertargetaction="hide" class="ghost">Cancelar</button>
    <button popovertarget="notice-confirm" popovertargetaction="hide" class="danger">Eliminar</button>
  </div>
</div>
