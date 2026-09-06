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

## tabs segmented

<div class="tabs segmented">
  <input class="tab-input" type="radio" name="ks-segmented" id="ks-seg-day" checked />
  <label class="tab" for="ks-seg-day">Day</label>
  <input class="tab-input" type="radio" name="ks-segmented" id="ks-seg-week" />
  <label class="tab" for="ks-seg-week">Week</label>
  <input class="tab-input" type="radio" name="ks-segmented" id="ks-seg-month" />
  <label class="tab" for="ks-seg-month">Month</label>
</div>

## tabs toggle

<div class="tabs toggle">
  <input class="tab-input" type="checkbox" id="format-bold" />
  <label class="tab" for="format-bold"><strong>B</strong></label>
  <input class="tab-input" type="checkbox" id="format-italic" />
  <label class="tab" for="format-italic"><em>I</em></label>
  <input class="tab-input" type="checkbox" id="format-underline" />
  <label class="tab" for="format-underline"><u>U</u></label>
</div>

## tabs pagination

<nav class="tabs pagination">
  <a class="tab">1</a>
  <span class="tab" aria-current="page">2</span>
  <a class="tab">3</a>
</nav>

## tabs bottom

<nav class="tabs bottom">
  <a class="tab">
    <div class="icon nf nf-fa-home text-lg">
    </div>
    <p>Home</p>
  </a>
  <a class="tab" aria-current="page">
    <div class="icon nf nf-fa-search text-lg">
    </div>
    <p>Search</p>
  </a>
  <a class="tab">
    <div class="icon nf nf-fa-user_astronaut text-lg">
    </div>
    <p>Profile</p>
  </a>
</nav>
