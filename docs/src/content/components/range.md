---
title: Range
category: Primitives
covers:
  - range
variants:
  - title: Con steps
    desc: <input type="range" data-ticks step min max style="--range-steps">
    html: |-
      <input type="range" min="0" max="100" step="20" data-ticks style="--range-steps: 5" />
  - title: Vertical
    desc: <input type="range" display-vertical>
    html: |-
      <input type="range" display-vertical style="height: 8rem" />
  - title: Vertical con steps
    html: |-
      <input type="range" min="0" max="100" step="25" display-vertical data-ticks style="--range-steps: 4; height: 8rem" />
---
<label>
  Range
  <input type="range" />
</label>
