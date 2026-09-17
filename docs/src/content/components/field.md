---
title: Field
category: Primitives
covers:
  - field
  - field-hint
  - row
---

<div class="demo-fields">
  <label class="field">
    <span>Nombre</span>
    <input type="text" placeholder="Ada Lovelace" />
    <small class="field-hint">Como figura en el documento.</small>
  </label>
  <label class="field">
    <span>Email</span>
    <input type="email" value="ada@ejemplo" aria-invalid="true" />
    <small class="field-hint">Falta el dominio.</small>
  </label>
</div>

## Fila

<div class="demo-fields">
  <label class="field row">
    <input type="checkbox" checked />
    <span>Recordarme</span>
  </label>
  <label class="field row">
    <input type="checkbox" role="switch" />
    <span>Notificaciones por email</span>
    <small class="field-hint">Un resumen diario.</small>
  </label>
</div>

## Deshabilitado

<div class="demo-fields">
  <label class="field">
    <span>Plan</span>
    <select disabled>
      <option>Pro</option>
    </select>
    <small class="field-hint">Lo administra el owner del workspace.</small>
  </label>
  <label class="field row">
    <input type="checkbox" disabled checked />
    <span>Facturación anual</span>
  </label>
</div>

## En un panel angosto

<div class="demo-fields-tight">
  <label class="field">
    <span>Familia</span>
    <select>
      <option>Marca abstracta</option>
      <option>Círculos geométricos</option>
    </select>
  </label>
  <label class="field">
    <span><code>--select-arrow-inset: var(--space-2)</code></span>
    <select style="--select-arrow-inset: var(--space-2)">
      <option>Marca abstracta</option>
      <option>Círculos geométricos</option>
    </select>
  </label>
  <label class="field">
    <span><code>padding-block</code> por clase propia</span>
    <span class="field row">
      <select class="demo-control">
        <option>Compacto</option>
      </select>
      <input class="demo-control" type="number" value="42" />
    </span>
  </label>
</div>

<style>
  .demo-fields {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 24rem;
  }
  .demo-fields-tight {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    width: 12rem;
  }
  .demo-fields-tight select,
  .demo-fields-tight input {
    min-width: 0;
  }
  .demo-control {
    padding-block: var(--space-1);
    --select-arrow-inset: var(--space-2);
  }
</style>
