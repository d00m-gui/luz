---
title: Modal
category: Overlays
covers:
  - modal
  - dialog
---

<button onclick="document.getElementById('modal-demo').showModal()">Open modal</button>
<dialog id="modal-demo" class="modal">
  <p>Modal content.</p>
  <button onclick="document.getElementById('modal-demo').close()">Close</button>
</dialog>
