---
title: Element
category: Surfaces
covers:
  - element
---

<div class="element pair" style="--element-aspect-ratio: 16 / 9">
  <img src="/samples/009-w.png" />
  <img src="/samples/005-w.png" />
</div>

## Square

<div class="element pair demo-square" style="--element-aspect-ratio: 1 / 1">
  <img src="/luz-logo.svg" />
  <img src="/luz-logo-rgb.svg" />
</div>

## Portrait

<div class="element pair demo-portrait" style="--element-aspect-ratio: 9 / 16">
  <div class="card">
    <p>1</p>
  </div>
  <div class="card">
    <p>2</p>
  </div>
</div>

<style>
  .demo-portrait {
    .card {
      align-items: center;
      justify-content: center;
      height: var(--element-width-min);
       p {
         font-size: 200%;
       }
    }
  }
  .demo-square {
    img {
      margin: 0 auto;
      background: var(--neutral-300);
      &:last-child {
        background: var(--neutral-700);        
      }
    }
  }
</style>
