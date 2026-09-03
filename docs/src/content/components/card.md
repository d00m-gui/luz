---
title: Card
category: Surfaces
covers:
  - card
variants:
  - title: Scheme
    desc: .card.success/.danger/.warning/.neutral/.contrast
    html: |-
      <div class="card success">
        <div class="card-title">Changes saved</div>
        <p>Deploy completed without errors.</p>
      </div>
      <div class="card danger">
        <div class="card-title">Something went wrong</div>
        <p>The last deploy failed.</p>
      </div>
      <div class="card warning">
        <div class="card-title">Check your input</div>
        <p>Some fields need review.</p>
      </div>
      <div class="card neutral">
        <div class="card-title">Draft</div>
        <p>Not published yet.</p>
      </div>
      <div class="card contrast">
        <div class="card-title">Pinned</div>
        <p>Card also takes the shared scheme classes, same as .btn/.badge/.alert.</p>
      </div>
---
<div class="card">
  <div class="card-title">Card title</div>
  <p>Card content goes here.</p>
  <div class="card-footer">Footer</div>
</div>
