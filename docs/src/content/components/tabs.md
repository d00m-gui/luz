---
title: Tabs
category: Navigation
covers:
  - tabs
  - tab
  - tab-input
  - segmented
  - toggle
---

<div class="tabs">
  <input class="tab-input" type="radio" name="ks-tabs" id="ks-tab-a" checked />
  <label class="tab" for="ks-tab-a">Overview</label>
  <input class="tab-input" type="radio" name="ks-tabs" id="ks-tab-b" />
  <label class="tab" for="ks-tab-b">Activity</label>
  <input class="tab-input" type="radio" name="ks-tabs" id="ks-tab-c" />
  <label class="tab" for="ks-tab-c">Settings</label>
</div>

<div class="tabs segmented">
  <input class="tab-input" type="radio" name="ks-segmented" id="ks-seg-day" checked />
  <label class="tab" for="ks-seg-day">Day</label>
  <input class="tab-input" type="radio" name="ks-segmented" id="ks-seg-week" />
  <label class="tab" for="ks-seg-week">Week</label>
  <input class="tab-input" type="radio" name="ks-segmented" id="ks-seg-month" />
  <label class="tab" for="ks-seg-month">Month</label>
</div>

<div class="tabs toggle">
  <input class="tab-input" type="checkbox" id="format-bold" />
  <label class="tab" for="format-bold"><strong>B</strong></label>
  <input class="tab-input" type="checkbox" id="format-italic" />
  <label class="tab" for="format-italic"><em>I</em></label>
  <input class="tab-input" type="checkbox" id="format-underline" />
  <label class="tab" for="format-underline"><u>U</u></label>
</div>

## Con icono y badge

<div class="tabs">
  <input class="tab-input" type="radio" name="ks-tabs-badge" id="ks-tab-inbox" checked />
  <label class="tab" for="ks-tab-inbox"><i class="icon nf nf-fa-inbox"></i> Inbox <span class="badge">3</span></label>
  <input class="tab-input" type="radio" name="ks-tabs-badge" id="ks-tab-sent" />
  <label class="tab" for="ks-tab-sent"><i class="icon nf nf-fa-paper_plane"></i> Enviados</label>
  <input class="tab-input" type="radio" name="ks-tabs-badge" id="ks-tab-spam" />
  <label class="tab" for="ks-tab-spam"><i class="icon nf nf-fa-ban"></i> Spam <span class="badge neutral">12</span></label>
</div>
