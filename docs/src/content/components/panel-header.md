---
title: Panel header
category: Layout
covers:
  - panel-header
  - panel-header-title
  - top
  - bottom
variants:
  - title: Titlebar
    desc: .panel-header.top
    preview: |-
      <div class="preview-frame"><div class="panel-header top" style="position: absolute; inset-inline: 0">
        <span>Titlebar</span>
        <span class="dot success"></span>
      </div></div>
    html: |-
      <div class="panel-header top">
        <span>Titlebar</span>
        <span class="dot success"></span>
      </div>
  - title: Statusbar
    desc: .panel-header.bottom
    preview: |-
      <div class="preview-frame"><div class="panel-header bottom" style="position: absolute; inset-inline: 0">
        <span>Ready</span>
        <span>v0.1.0</span>
      </div></div>
    html: |-
      <div class="panel-header bottom">
        <span>Ready</span>
        <span>v0.1.0</span>
      </div>
---

<div class="panel-header">
  <span class="panel-header-title">Panel header</span>
  <button class="ghost">Action</button>
</div>
