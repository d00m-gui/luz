---
title: Tabs
category: Navigation
covers:
  - tabs
  - tab
  - tab-input
  - segmented
  - toggle
  - pagination
  - bottom
  - nav
---

<div class="tabs">
  <input class="tab-input" type="radio" name="ks-tabs" id="ks-tab-a" checked />
  <label class="tab" for="ks-tab-a">Overview</label>
  <input class="tab-input" type="radio" name="ks-tabs" id="ks-tab-b" />
  <label class="tab" for="ks-tab-b">Activity</label>
  <input class="tab-input" type="radio" name="ks-tabs" id="ks-tab-c" />
  <label class="tab" for="ks-tab-c">Settings</label>
</div>

## Segmented control — .tabs.segmented

<div class="tabs segmented">
  <input class="tab-input" type="radio" name="ks-segmented" id="ks-seg-day" checked />
  <label class="tab" for="ks-seg-day">Day</label>
  <input class="tab-input" type="radio" name="ks-segmented" id="ks-seg-week" />
  <label class="tab" for="ks-seg-week">Week</label>
  <input class="tab-input" type="radio" name="ks-segmented" id="ks-seg-month" />
  <label class="tab" for="ks-seg-month">Month</label>
</div>

## Toggle — .tabs.toggle

<div class="tabs toggle">
  <input class="tab-input" type="checkbox" id="format-bold" />
  <label class="tab" for="format-bold"><strong>B</strong></label>
  <input class="tab-input" type="checkbox" id="format-italic" />
  <label class="tab" for="format-italic"><em>I</em></label>
  <input class="tab-input" type="checkbox" id="format-underline" />
  <label class="tab" for="format-underline"><u>U</u></label>
</div>

## Pagination — .tabs.pagination

<nav class="tabs pagination">
  <a class="tab">1</a>
  <a class="tab" aria-current="page">2</a>
  <a class="tab">3</a>
</nav>

## Bottom tab bar — .tabs.bottom

<!--preview-->
<div class="preview-frame"><nav class="tabs bottom" style="position: absolute">
  <a class="tab" aria-current="page">Home</a>
  <a class="tab">Search</a>
  <a class="tab">Profile</a>
</nav></div>
<!--/preview-->

<nav class="tabs bottom">
  <a class="tab" aria-current="page">Home</a>
  <a class="tab">Search</a>
  <a class="tab">Profile</a>
</nav>
