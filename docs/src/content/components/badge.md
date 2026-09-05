---
title: Badge
category: Data
covers:
  - badge
---

<span class="badge">Default</span>

## Variants

<span class="badge success">Success</span>
<span class="badge danger">Danger</span>
<span class="badge warning">Warning</span>
<span class="badge neutral">Neutral</span>
<span class="badge contrast">Contrast</span>
<span class="badge ghost">Ghost</span>

<div class="join">
  <button class="badge"><i class="icon nf nf-md-eye"></i></button>
  <span class="badge">View</span>
  <button popovertarget="menu-view" class="ghost"><i class="icon nf nf-md-dots_vertical"></i></button>
</div>
<div id="menu-view" popover class="menu">
  <a class="list-row"><i class="icon nf nf-cod-edit_code"></i><span class="list-col-grow">Edit</span></a>
  <a class="list-row"><i class="icon nf nf-oct-duplicate"></i><span class="list-col-grow">Duplicate</span></a>
  <a class="list-row" aria-disabled="true"><i class="icon nf nf-fa-lock"></i><span class="list-col-grow">Facturación</span></a>
  <a class="list-row danger"><i class="icon nf nf-fa-trash_can"></i><span class="list-col-grow">Delete</span><span><kbd>Meta</kbd>+<kbd>D</kbd></span></a>
</div>
<div class="join">
  <span class="badge">Search</span>
  <input type="text" placeholder="Type..." />
  <button class="badge"><i class="icon nf nf-seti-search"></i></button>
</div>

<div class="join">
  <span class="badge">Add</span>
  <button class="badge success"><i class="icon nf nf-fa-plus"></i></button>
</div>

<div class="join">
  <span class="badge">Delete</span>
  <button class="badge danger"><i class="icon nf nf-fa-trash_can"></i></button>
</div>
