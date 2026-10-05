---
title: Field
category: Primitives
covers:
  - field
  - field-hint
  - row
  - field-affix
  - short
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

## Placeholder deshabilitado — un <code>&lt;option disabled&gt;</code> no apaga el <code>.field</code>; solo un control deshabilitado lo hace

<div class="demo-fields">
  <label class="field">
    <span>Preset</span>
    <select>
      <option value="" disabled selected>Elegí…</option>
      <option>Marca</option>
      <option>Producto</option>
    </select>
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

## Afijos y campo corto

<div class="demo-fields" style="flex-direction: row">
  <label class="field short" style="--field-width: var(--space-24)">
    <span class="field-affix">X</span>
    <input type="number" aria-label="Posición X" value="595" />
  </label>
  <label class="field short" style="--field-width: var(--space-24)">
    <span class="field-affix">W</span>
    <input type="number" aria-label="Ancho" value="280" />
    <span class="field-affix">px</span>
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
