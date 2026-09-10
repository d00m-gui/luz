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
  - form-actions
  - sticky
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

## Acciones

<form class="form form-fit demo-form-actions">
  <div class="scroll-y" style="--scroll-max: 12rem;">
    <label class="field">
      <span>Nombre del proyecto</span>
      <input type="text" placeholder="luz" />
    </label>
    <label class="field">
      <span>Descripción</span>
      <textarea rows="3" placeholder="Qué hace y para quién."></textarea>
    </label>
    <label class="field">
      <span>Visibilidad</span>
      <select>
        <option>Privado</option>
        <option>Público</option>
      </select>
    </label>
    <label class="field row">
      <input type="checkbox" checked />
      <span>Crear README inicial</span>
    </label>
    <div class="form-actions sticky">
      <button type="reset">Cancelar</button>
      <button type="submit">Guardar</button>
    </div>
  </div>
</form>

<style>
  .demo-form-actions .scroll-y > * + * {
    margin-block-start: var(--space-3);
  }
</style>
