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

<style>
  .demo-fields {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 24rem;
  }
</style>
