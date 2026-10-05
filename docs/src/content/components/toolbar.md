---
title: Toolbar
category: Layout
covers:
  - toolbar
  - toolbar-group
  - end
  - vertical
  - floating
  - bottom
---

<div class="toolbar">
  <div class="toolbar-group">
    <button type="button" class="ghost">Select</button>
    <button type="button" class="ghost">Draw</button>
  </div>
  <div class="toolbar-group end">
    <button type="button" class="ghost">Zoom</button>
  </div>
</div>

## Vertical y flotante

<div class="toolbar vertical floating" style="width: fit-content">
  <div class="toolbar-group"><button type="button" class="ghost">Select</button></div>
  <div class="toolbar-group"><button type="button" class="ghost">Draw</button></div>
</div>

## Barra de estado — <code>.toolbar.bottom</code>: hairline arriba, <code>flex: 0 0 auto</code> y texto chico; dentro de un <code>.shell</code> coincide con el hairline del shell, no se duplica

<div class="shell vertical" style="height: 10rem">
  <div class="shell-body">Lienzo</div>
  <div class="toolbar bottom">
    <div class="toolbar-group"><span class="swatch" style="--swatch-color: #e8590c"></span> Relleno</div>
    <div class="toolbar-group end">100 %</div>
  </div>
</div>
