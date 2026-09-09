---
title: Element
category: Surfaces
covers:
  - element
wip: true
---

<div class="element">
  <div class="card element-wide">
    <div class="card-content">
      <p>4/3 ratio</p>
    </div>
  </div>
  <div class="card element-portrait">
    <div class="card-content">
      <p>2/3 ratio</p>
    </div>
  </div>
</div>

## Square

<div class="element pair demo-square">
  <img src="/luz-logo.svg" />
  <img src="/luz-logo-rgb.svg" />
</div>

## Portrait

<div class="element pair demo-portrait">
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
