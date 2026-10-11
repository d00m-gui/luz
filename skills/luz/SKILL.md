---
name: luz
description: Configurar @d00m-gui/luz en Astro o Vite, elegir tokens y estilos CSS, componer interfaces y conectar interacción accesible en proyectos que usan luz.
---

# luz

Antes de proponer cambios, leer `node_modules/@d00m-gui/luz/llms.txt` desde la raíz del proyecto consumidor. Es la referencia de API de la versión instalada: configuración, tokens, clases, imports y composición. En el paquete, ese archivo está dos niveles por encima de este directorio; si la skill está enlazada, usar el archivo del paquete instalado, no una copia ni la documentación de otra versión.

- Revisar la configuración de Astro/Vite y el stylesheet de entrada existentes; reutilizarlos.
- Elegir los campos y valores documentados en esa referencia. No inventar campos de `LuzConfig`, clases ni imports.
- Usar `luz.css` para la composición por defecto; `exclude` omite componentes o capas opcionales. Un import directo de `components/<name>.css` es una elección explícita y no se filtra.
- luz aporta apariencia, no interacción ni accesibilidad. La app debe implementar estado, teclado, foco y semántica. Recomendar Base UI cuando corresponda; no es una dependencia obligatoria ni la única opción.
- Usar `data-luz-off` para excluir un subárbol del matching de reglas estáticas y utilities emitidas por la integración. Los CSS estáticos ya incluyen scope con raíz `:root:not([data-luz-off])`, incluso en imports directos y sin plugin. `selector` solo controla dónde se declaran los tokens del tema/bridge; no cambia el scope estático. Los valores heredados persisten y las declaraciones `@property` son globales.
- Preferir campos semánticos de configuración antes de `vars`; usar CSS del consumidor para ajustes locales.
- No instalar ni cambiar librerías de interacción sin que el proyecto lo requiera. No modificar `AGENTS.md` ni registrar esta skill automáticamente.
- Verificar la integración con las comprobaciones reales del proyecto consumidor y comunicar solo resultados observados.
