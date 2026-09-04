---
title: Menu
category: Overlays
covers:
  - menu
variants:
  - title: Menú contextual
    desc: click derecho
    html: |-
      <div class="card" style="anchor-name: --ctx-anchor; text-align: center; cursor: context-menu" oncontextmenu="event.preventDefault(); this.nextElementSibling.showPopover()">
        Right-click here
      </div>
      <div popover id="menu-ctx" class="menu" style="position-anchor: --ctx-anchor">
        <a class="list-row">Cut</a>
        <a class="list-row">Copy</a>
        <a class="list-row">Paste</a>
      </div>
---

<button popovertarget="menu-basic" class="ghost">⋮ Options</button>
<div id="menu-basic" popover class="menu">
  <a class="list-row"><i class="icon nf nf-cod-edit_code"></i><span class="list-col-grow">Edit</span></a>
  <a class="list-row"><i class="icon nf nf-oct-duplicate"></i><span class="list-col-grow">Duplicate</span></a>
  <a class="list-row" aria-disabled="true"><i class="icon nf nf-fa-lock"></i><span class="list-col-grow">Facturación</span></a>
  <a class="list-row danger"><i class="icon nf nf-fa-trash_can"></i><span class="list-col-grow">Delete</span><span><kbd>Meta</kbd>+<kbd>D</kbd></span></a>
</div>
