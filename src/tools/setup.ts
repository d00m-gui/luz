export function setup(tokens: any) {
  const { name, prefix, neutrals } = { ...tokens.settings };
  return `
    a {
      color: var(--anchor, var(--${prefix}blue));
      &.secondary {
      	--anchor: var(--${prefix}secondary-500);
      }
      &.contrast {
      	--anchor: var(--${prefix}${neutrals}-500);
      }
      &.danger {
      	--anchor: var(--${prefix}red);
      }
      &.success {
      	--anchor: var(--${prefix}emerald);
      }
      &.warning {
      	--anchor: var(--${prefix}yellow);
      }
    }
    hr {
      background: var(--${prefix}${name});
      color: var(--${prefix}${name});
    }
    kbd {
      border: var(--border-width) solid var(--${prefix}${name}-900);
      background-color: var(--${prefix}${name}-500);
      color: var(--on-${prefix}${name});
      box-shadow:
        inset 0 0 var(--size-3) var(--size-3) var(--${prefix}${name}-300),
        inset 0 -1rem var(--size-5) var(--size-2) var(--${prefix}${name}-600),
        0 0 0 var(--size-1) var(--${prefix}${name}-600);
    }
    table {
      tr:hover {
        background-color: var(--${prefix}${name}-800);
        color: var(--${prefix}${name}-300);
      }
      th {
        background-color: var(--element-background);
      }
    }
    mark,
    &::selection, &::-moz-selection {
      background-color: var(--${prefix}${name}-500);
      color: var(--on-${prefix}${name});
      outline: 3px solid var(--${prefix}${name}-500);
    }
    label[for="file"],
    &[role="file"],
    &[file-] {
      input[type="file"] {
        &::file-selector-button {
          border-top: var(--border-width) solid var(--${prefix}${name}-200);
        }
      }
    }
    input[type="range"] {
      background-color: var(--${prefix}${neutrals}-900);
      box-shadow: inset 0 0 0 var(--border-width) var(--${prefix}${neutrals}-600);
      &:active {
        &::-webkit-slider-thumb,
        &::-moz-range-thumb {
          background: var(--${prefix}${name}-500);
        }
      }
    }
    [type="checkbox"],
    [type="radio"],
    [type="range"],
    progress {
      accent-color: var(--${prefix}${name}-500);
    }
    [type="checkbox"],
    [type="radio"] {
      color: var(--${prefix}${name}-100);
      &:checked {
        background-color: var(--${prefix}${name}-500);
        border-color: var(--${prefix}${name}-200);
      }
    }
    [type="checkbox"][role="switch"] {
      &::before {
        background-color: var(--${prefix}${name}-500);
      }
      &:checked {
        background-color: var(--${prefix}${name}-500);
      }
    }
    [type="radio"] {
      &::before {
        background-color: var(--${prefix}-secondary-500);
      }
      &:checked {
        background-color: var(--${prefix}${name}-500);
        border-color: var(--${prefix}${name}-500);
      }
    }
    blockquote {
      border-left: 0.25rem solid var(--${prefix}${name}-200);
      border-inline-start: 0.25rem solid var(--${prefix}${name}-200);
      footer {
        color: var(--${prefix}${name}-500);
      }
    }
    .btn,
    .button,
    button[type="submit"],
    [role="button"],
    [type="button"],
    [type="file"]::file-selector-button,
    [type="reset"],
    [type="submit"],
    button {
      background-color: var(--${prefix}${name}-500);
      color: var(--on-${prefix}${name});
      &[role="secondary"],
      &[role="alternative"] {
        background-color: var(--${prefix}secondary-500);
        color: var(--on-${prefix}secondary);
      }
      &[type="reset"],
      &[role="cancel"], &.cancel, &.reset {
        background-color: var(--${prefix}${neutrals}-500);
      }
      &[role="apply"], &.apply, &.success {
        background-color: var(--${prefix}green);
      }
      &[role="contrast"], &.contrast {
        background-color: var(--foreground);
        color: var(--background);
      }
      &.danger {
      	background-color: var(--${prefix}red);
      }
      &.warning {
        background-color: var(--${prefix}yellow);
      }
      &.ghost {
        background-color: transparent;
        color: var(--${prefix}${name}-400);
      }
      &:hover, &.over {
        filter: brightness(1.1);
      }
      &:active, &.pressed {
        filter: brightness(1.3);
        transform: scale(0.98);
      }
    }
    input[aria-invalid="false"] {
      border-color: var(--${prefix}green);
      color: var(--${prefix}green);
      &::placeholder {
        color: var(--${prefix}green);
      }
    }
    input[aria-invalid="true"] {
      border-color: var(--${prefix}red);
      color: var(--${prefix}red);
      &::placeholder {
        color: var(--${prefix}red);
      }
    }
    [data-tooltip] {
      &[data-placement="top"]::before,
      &::before {
        background: var(--${prefix}${name}-900);
        color: var(--${prefix}${name}-100);
      }
    }

    .loading::before, [aria-busy="true"]:not(input, select, textarea, html, form)::before {
      content: "⠙";
      display: inline-block;
      font-family: var(--font-monospace);
      font-weight: bold;
      text-align: center;
      padding: 0;
      flex: 1 1 auto;
      color: currentColor;
      margin: 0 var(--size-5);
      cursor: wait;
      animation: loading 1s steps(1, end) infinite;
    }

    body.root.luz-loaded {
      opacity: 0;
      animation: suspense 500ms 200ms cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
    }
    @keyframes suspense {
      0% {
        opacity: 0;
        visibility: hidden;
        background-color: #333;
      }
      100% {
        opacity: 1;
        visibility: visible;
        background-color: var(--background);
      }
    }

    @keyframes loading {
      0% { content: "⠋"; }
      10% { content: "⠙"; }
      20% { content: "⠹"; }
      30% { content: "⠸"; }
      40% { content: "⠼"; }
      50% { content: "⠴"; }
      60% { content: "⠦"; }
      70% { content: "⠧"; }
      80% { content: "⠇"; }
      90% { content: "⠏"; }
      100% { content: "⠋"; }
    }
  `;
}
