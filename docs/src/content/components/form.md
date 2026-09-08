---
title: Form
category: Primitives
covers:
  - form
  - fieldset
  - label
  - checkbox
  - radio
  - switch
span: 2
---

<form class="form form-fit">
  <fieldset>
    <legend>Form</legend>
    <label class="join">
      <span>Full name</span>
      <input type="text" placeholder="Ada Lovelace" />
    </label>
    <label class="join">
      <span>Email</span>
      <input type="email" placeholder="user@email.tld" />
      <i class="icon nf nf-md-email"></i>
    </label>
    <label class="join"><span><input type="checkbox" checked /></span> <span>Remember me</span></label>
    <label class="join no-border">
      <span>Please do not track</span>
      <span><input type="checkbox" role="switch" checked /></span>
    </label>
    <div class="join">
      <label class="join no-border">
        <span><input type="radio" name="ks-radio" checked /></span>
        <span>Red Pill</span>
      </label>
      <label class="join no-border">
        <span><input type="radio" name="ks-radio" /></span>
        <span>Blue Pill</span>
      </label>
    </div>

  </fieldset>
</form>
