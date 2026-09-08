---
title: Notice
category: Overlays
covers:
  - notice
---

<button popovertarget="notice-bottom-end" class="ghost">bottom-end</button>
<div id="notice-bottom-end" popover class="notice notice-card card">
  <div class="card-meta">
    <p><i class="icon nf nf-fa-bell"></i> Hello there</p>
    <div class="space"></div>
    <button popovertarget="notice-bottom-end" popovertargetaction="hide" class="ghost square icon">&times;</button>
  </div>
  <div class="card-content">
    <p>The <strong>default</strong> Notification message from <mark>bottom end</mark></p>
    <p>Notices like this one can carry a full <code>.card</code> layout —
    title, body copy and actions — instead of a single line, useful
    for updates that need a bit more context before they dismiss.</p>
  </div>
  <div class="card-footer">
    <div class="space"></div>
    <button popovertarget="notice-bottom-end" popovertargetaction="hide" class="neutral">Hey, there!</button>
  </div>
</div>

<button popovertarget="notice-top-start" class="ghost">top-start</button>
<div id="notice-top-start" popover class="notice top-start notice-card card">
  <div class="card-meta">
    <p><i class="icon nf nf-fa-bell"></i> Hello there</p>
    <div class="space"></div>
    <button popovertarget="notice-top-start" popovertargetaction="hide" class="ghost square icon">&times;</button>
  </div>
  <div class="card-content">
    <p>The <strong>default</strong> Notification message from <mark>top start</mark></p>
    <p>Notices like this one can carry a full <code>.card</code> layout —
    title, body copy and actions — instead of a single line, useful
    for updates that need a bit more context before they dismiss.</p>
  </div>
  <div class="card-footer">
    <div class="space"></div>
    <button popovertarget="notice-top-start" popovertargetaction="hide" class="neutral">Hey, there!</button>
  </div>
</div>

<button popovertarget="notice-top-end" class="ghost">top-end</button>
<div id="notice-top-end" popover class="notice top-end notice-card card">
  <div class="card-meta">
    <p><i class="icon nf nf-fa-bell"></i> Hello there</p>
    <div class="space"></div>
    <button popovertarget="notice-top-end" popovertargetaction="hide" class="ghost square icon">&times;</button>
  </div>
  <div class="card-content">
    <p>The <strong>default</strong> Notification message from <mark>top end</mark></p>
    <p>Notices like this one can carry a full <code>.card</code> layout —
    title, body copy and actions — instead of a single line, useful
    for updates that need a bit more context before they dismiss.</p>
  </div>
  <div class="card-footer">
    <div class="space"></div>
    <button popovertarget="notice-top-end" popovertargetaction="hide" class="neutral">Hey, there!</button>
  </div>
</div>

<button popovertarget="notice-bottom-start" class="ghost">bottom-start</button>
<div id="notice-bottom-start" popover class="notice bottom-start notice-card card">
  <div class="card-meta">
    <p><i class="icon nf nf-fa-bell"></i> Hello there</p>
    <div class="space"></div>
    <button popovertarget="notice-bottom-start" popovertargetaction="hide" class="square icon">&times;</button>
  </div>
  <div class="card-content">
    <p>The <strong>default</strong> Notification message from <mark>bottom start</mark></p>
    <p>Notices like this one can carry a full <code>.card</code> layout —
    title, body copy and actions — instead of a single line, useful
    for updates that need a bit more context before they dismiss.</p>
  </div>
  <div class="card-footer">
    <div class="space"></div>
    <button popovertarget="notice-bottom-start" popovertargetaction="hide" class="primary">Hey, there!</button>
  </div>
</div>


## Feedback

<button popovertarget="notice" class="success">Show notice</button>
<div id="notice" popover class="notice success"><i class="icon nf nf-fa-check_circle"></i> Saved successfully</div>

<button popovertarget="notice-danger" class="danger">Show error notice</button>
<div id="notice-danger" popover class="notice danger"><i class="icon nf nf-fa-times_circle"></i> Something went wrong</div>

<button popovertarget="notice-warning" class="warning">Show warning notice</button>
<div id="notice-warning" popover class="notice warning"><i class="icon nf nf-fa-exclamation_triangle"></i> Check your input</div>

<button popovertarget="notice-info" class="info">Show info notice</button>
<div id="notice-info" popover class="notice info"><i class="icon nf nf-fa-info_circle"></i> New version available</div>

## Quick Actions

<div>
  <button popovertarget="notice-confirm">Show notice with actions</button>
  <div id="notice-confirm" popover class="notice">
    <i class="icon nf nf-fa-bell"></i>
    <span>Delete this file?</span>
    <button popovertarget="notice-confirm" popovertargetaction="hide">Cancelar</button>
    <button popovertarget="notice-confirm" popovertargetaction="hide" class="danger outline">Eliminar</button>
  </div>
</div>
