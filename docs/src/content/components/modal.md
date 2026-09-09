---
title: Modal
category: Overlays
covers:
  - modal
  - dialog
---

<button onclick="document.getElementById('modal-demo').showModal()">Open modal</button>
<dialog id="modal-demo" class="modal">
  <div class="card">
    <div class="card-meta">
      <strong>Invitar colaborador</strong>
    </div>
    <div class="card-content">
      <p>Vas a compartir <strong>luz-docs</strong> con acceso de edición.
      Va a poder ver y modificar el proyecto.</p>
    </div>
    <div class="card-footer">
      <div class="space"></div>
      <button class="ghost" onclick="document.getElementById('modal-demo').close()">Cancelar</button>
      <button class="neutral" onclick="document.getElementById('modal-demo').close()">Invitar</button>
    </div>
  </div>
</dialog>
