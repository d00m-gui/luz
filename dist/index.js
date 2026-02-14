import Q from"chroma-js";function X(T){let{name:D,prefix:$,neutrals:L}={...T.settings};return`
    a {
      color: var(--anchor, var(--${$}blue));
    }
    hr {
      background: var(--${$}${D});
      color: var(--${$}${D});
    }
    kbd {
      border: var(--border-width) solid var(--${$}${D}-900);
      background-color: var(--${$}${D}-500);
      box-shadow:
        inset 0 0 5px var(--size-5) var(--${$}${D}-300),
        inset 0 -1rem 5px 2px var(--${$}${D}-500),
        0 0 0 1px var(--${$}${D}-100);
    }
    table {
      tr:hover {
        background-color: var(--element-background);
      }
      th {
        background-color: var(--element-background);
      }
    }
    mark,
    &::selection {
      background-color: var(--${$}${D}-500);
    }
    label[for="file"],
    &[role="file"],
    &[file-] {
      input[type="file"] {
        &::file-selector-button {
          border-top: var(--border-width) solid var(--${$}${D}-200);
        }
      }
    }
    input[type="range"] {
      background-color: var(--${$}${L}-500);
      box-shadow: inset 0 0 0 var(--border-width) var(--${$}${L}-600);
      &:active {
        &::-webkit-slider-thumb,
        &::-moz-range-thumb {
          background: var(--${$}${D}-500);
        }
      }
    }
    [type="checkbox"],
    [type="radio"],
    [type="range"],
    progress {
      accent-color: var(--${$}${D}-500);
    }
    [type="checkbox"],
    [type="radio"] {
      color: var(--${$}${D}-100);
      &:checked {
        background-color: var(--${$}${D}-500);
        border-color: var(--${$}${D}-200);
      }
    }
    [type="checkbox"][role="switch"] {
      &::before {
        background-color: var(--${$}${D}-500);
      }
      &:checked {
        background-color: var(--${$}${D}-500);
      }
    }
    [type="radio"] {
      &::before {
        background-color: var(--${$}-secondary-500);
      }
      &:checked {
        background-color: var(--${$}${D}-500);
        border-color: var(--${$}${D}-500);
      }
    }
    blockquote {
      border-left: 0.25rem solid var(--${$}${D}-200);
      border-inline-start: 0.25rem solid var(--${$}${D}-200);
      footer {
        color: var(--${$}${D}-500);
      }
    }
    button[type="submit"],
    [role="button"],
    [type="button"],
    [type="file"]::file-selector-button,
    [type="reset"],
    [type="submit"],
    button {
      background-color: var(--${$}${D}-500);
      color: var(--on-${$}${D});
      &[role="secondary"],
      &[role="alternative"] {
        background-color: var(--${$}secondary-500);
        color: var(--on-${$}secondary);
      }
      &[type="reset"],
      &[role="cancel"] {
        background-color: var(--${$}blue);
      }
      &[role="apply"] {
        background-color: var(--${$}green);
      }
      &[role="contrast"] {
        background-color: var(--foreground);
        color: var(--background);
      }
    }
    input[aria-invalid="false"] {
      border-color: var(--${$}green);
      color: var(--${$}green);
      &::placeholder {
        color: var(--${$}green);
      }
    }
    input[aria-invalid="true"] {
      border-color: var(--${$}red);
      color: var(--${$}red);
      &::placeholder {
        color: var(--${$}red);
      }
    }
    [data-tooltip] {
      &[data-placement="top"]::before,
      &::before {
        background: var(--${$}${D}-900);
        color: var(--${$}${D}-100);
      }
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
  `}var Z=`
  html,
  body {
    font-size: 62.5%;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  dd,
  dl,
  dt,
  li,
  ol,
  ul,
  fieldset,
  form,
  label,
  legend,
  button,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  figure {
    border: 0;
    margin: 0;
    padding: 0;
    font-family: inherit;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  ol,
  ul {
    list-style: none;
  }
  q:before,
  q:after,
  blockquote:before,
  blockquote:after {
    content: "";
  }
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  nav,
  section,
  summary {
    display: block;
  }
  audio,
  canvas,
  video {
    display: inline-block;
  }
  audio:not([controls]) {
    height: 0;
    display: none;
  }
  [hidden],
  .hidden {
    display: none;
  }
  *,
  :before,
  :after {
    box-sizing: inherit;
  }
  img,
  picture,
  video,
  canvas,
  svg {
    max-width: 100%;
    display: block;
  }
  input,
  button,
  textarea,
  select {
    font: inherit;
  }
  #root,
  #__next {
    isolation: isolate;
  }
  html,
  body {
    interpolate-size: allow-keywords;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font);
    font-weight: 400;
    font-size: var(--size-16);
  }
  a {
    text-transform: none;
    font-weight: inherit;
    border: none;
    outline: none;
    text-decoration: underline;
    & img {
      cursor: pointer;
      border: none;
      outline: none;
    }
    &:active,
    &:hover,
    &:visited {
      cursor: pointer;
      outline: none;
    }
    &:hover {
      filter: brightness(1.1);
      transition: var(--transition);
    }
  }
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
    text-box: trim-both cap text;
    text-wrap: pretty;
    font-size: var(--size-16);
    line-height: var(--line-height);
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-headings);
    line-height: calc(var(--line-height) - 30%);
    font-weight: var(--font-bold-weight);
  }
  h1 {
    font-size: var(--size-22);
  }
  h2 {
    font-size: var(--size-21);
  }
  h3 {
    font-size: var(--size-20);
  }
  h4 {
    font-size: var(--size-19);
  }
  h5 {
    font-size: var(--size-18);
  }
  h6 {
    font-size: var(--size-17);
  }
  address,
  blockquote,
  dl,
  ol,
  p,
  pre,
  table,
  ul {
    color: currentColor;
    font-weight: var(--font-weight);
  }
  ul li {
    margin-left: var(--element-vertical);
    list-style: inside square;
  }
  hr {
    clear: both;
    float: none;
    height: 0;
    margin: var(--size-16) 0;
    border: none;
    width: 100%;
    height: 0.1rem;
  }
  br {
    float: none;
    clear: both;
    width: 100%;
    height: 0;
    margin: 0.5rem 0;
    display: block;
    overflow: hidden;
  }
  small {
    font-size: var(--size-13);
  }
  abbr {
    border-bottom: var(--border-width) dotted var(--foreground);
  }
  kbd {
    font-size: var(--size-13);
    padding: var(--size-6);
    padding-bottom: var(--size-12);
    border-radius: var(--border-radius);
    color: var(--background);
    font-weight: var(--font-bold-weight);
  }
  strong,
  b {
    font-weight: var(--font-bold-weight, 700);
  }
  em {
    font-family: var(--font-emphasis);
  }
  figure {
    & img {
      width: 100%;
    }
  }
  table {
    padding: var(--size-16);
    margin: var(--size-16) 0;
    & th {
      color: var(--foreground);
      padding: var(--size-16);
    }
    & td {
      border-bottom-color: var(--background);
      padding: var(--size-16);
    }
  }
  code,
  pre,
  samp {
    font-family: var(--font-monospace);
    overflow-x: auto;
    & > code {
      padding: var(--size-16);
    }
  }
  form {
    flex-direction: column;
    display: flex;
    &[role="row"] {
      flex-direction: row;
    }
  }
  fieldset {
    gap: calc(var(--size-16) / 2);
    padding: var(--element-vertical) 0;
    flex-direction: column;
    display: flex;
  }
  label {
    gap: calc(var(--size-16) / 2);
    width: fit-content;
    margin-bottom: calc(var(--size-16) / 2);
    flex-direction: column;
    align-items: flex-start;
    font-weight: 700;
    display: flex;
    &[row-] {
      gap: var(--size-16);
      flex-flow: wrap;
      align-items: center;
      line-height: 90%;
    }
  }
  input,
  select,
  textarea {
    will-change: auto;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: var(--border-width) solid var(--element-border-color);
    border-radius: var(--border-radius);
    background-color: var(--element-background);
    color: var(--element-color);
    font-weight: var(--font-weight);
    transition: var(--transition);
    outline: 0;
  }
  input,
  optgroup,
  select,
  textarea {
    line-height: var(--line-height);
    letter-spacing: inherit;
    font-family: inherit;
    font-size: var(--size-16);
    overflow: visible;
  }
  input,
  optgroup,
  select,
  textarea,
  label,
  .disabled {
    &[disabled],
    &[disabled-],
    &.disabled {
      user-select: none;
      pointer-events: none;
      cursor: not-allowed;
      opacity: 0.4;
    }
  }
  input:not([type="color"], [type="checkbox"], [type="radio"], [type="range"]),
  select,
  textarea {
    padding: var(--element-vertical) var(--element-horizontal);
  }
  input[type="search"] {
    border-radius: var(--size-20);
  }
  select {
    padding-right: var(--size-20);
    position: relative;
  }
  label[for="file"],
  &[role="file"],
  &[file-] {
    & input[type="file"] {
      padding: var(--size-16);
      padding-bottom: calc(var(--size-16) * 3);
      text-align: center;
      border-style: dashed;
      font-weight: 700;
      display: block;
      position: relative;
      &::file-selector-button {
        font-size: var(--size-16);
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        text-align: center;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
      }
    }
  }
  input[type="range"] {
    width: 100%;
    height: var(--size-10);
    transition: var(--transition);
    background: 0 0;
    border: none;
    &:focus {
      transition: var(--transition);
      outline: none;
      &::-webkit-slider-thumb,
      &::-moz-range-thumb {
        transition: var(--transition);
      }
    }
    &:active {
      transition: var(--transition);
      &::-webkit-slider-thumb,
      &::-moz-range-thumb {
        transform: scale(calc(var(--base) / 10));
      }
    }
    &::-webkit-slider-thumb,
    &::-moz-range-thumb {
      box-shadow: inset 0 0 0 var(--border-width)
        var(--element-placeholder-color);
      height: var(--size-15);
      width: var(--size-15);
      background: var(--element-placeholder-color);
      cursor: pointer;
      border-radius: var(--size-10);
      transition: var(--transition);
      border: none;
    }
    &[display-vertical] {
      height: auto;
      width: var(--size-10);
      writing-mode: sideways-lr;
    }
  }
  input:where(select, textarea):not([readonly]):is(:active, :focus),
  input:not(
      [type="submit"],
      [type="button"],
      [type="reset"],
      [role="switch"],
      [readonly]
    ):is(:active, :focus) {
    border-color: var(--element-active-border-color);
    filter: brightness(1.05);
  }
  input::-webkit-input-placeholder,
  input::placeholder,
  select:invalid,
  textarea::-webkit-input-placeholder,
  textarea::placeholder {
    color: var(--element-placeholder-color);
    opacity: 1;
  }
  [type="checkbox"],
  [type="radio"] {
    border-radius: var(--border-radius);
    background-color: var(--element-background);
    width: var(--size-16);
    height: var(--size-16);
    flex: none;
    margin: 0;
    transition: all 0.12s ease-in-out;
    display: inline-block;
    position: relative;
    &:checked {
      margin: 0;
      transition: all 0.12s ease-in-out;
    }
    &:before {
      content: "";
      transform-origin: 50%;
      border-bottom: 0.2rem solid var(--element-active-color);
      border-right: 0.2rem solid var(--element-active-color);
      width: 0.7rem;
      height: 1.2rem;
      transition: all 0.12s ease-in-out;
      display: block;
      position: absolute;
      top: 45%;
      left: calc(50% - 0.5rem);
      transform: rotate(0) translate(-50%) translateY(-50%) scale(0);
    }
    &:checked:before {
      transition: all 0.12s ease-in-out;
      transform: rotate(45deg) translate(-50%) translateY(-50%) scale(1);
    }
  }
  [type="checkbox"][role="switch"] {
    width: calc(var(--size-16) * 3);
    height: calc(var(--size-16) * 1.5);
    border-radius: var(--size-16);
    position: relative;
    &:before {
      content: "";
      width: var(--size-16);
      height: var(--size-16);
      transition: var(--transition);
      will-change: auto;
      border: none;
      border-radius: 100%;
      display: block;
      position: absolute;
      top: 50%;
      left: 5%;
      transform: translateY(-50%);
    }
    &:checked {
      filter: brightness(1.1);
      &:before {
        background-color: var(--background);
        filter: brightness(1.1);
        left: calc(96% - var(--size-16));
      }
    }
  }
  [type="radio"] {
    width: var(--size-16);
    height: var(--size-16);
    border-radius: 100%;
    &:before {
      transform-origin: 50%;
      width: var(--size-12);
      height: var(--size-12);
      border: none;
      border-radius: 100%;
      top: 50%;
      left: 50%;
      transform: rotate(0) translate(-50%) translateY(-50%) scale(0);
    }
    &:checked {
      &:before {
        background-color: var(--element-active-color);
        transform: rotate(0) translate(-50%) translateY(-50%) scale(1);
      }
    }
  }
  blockquote {
    margin: var(--element-vertical) 0;
    padding: var(--size-16);
    border-right: none;
    border-inline-end: none;
    display: block;
    & footer {
      margin-top: calc(var(--element-vertical) * 0.5);
    }
  }
  button[type="submit"],
  [role="button"],
  [type="button"],
  [type="file"]::file-selector-button,
  [type="reset"],
  [type="submit"],
  button {
    padding: var(--element-vertical) var(--element-horizontal);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    font-weight: var(--font-weight);
    font-size: var(--size-16);
    line-height: var(--line-height);
    text-align: left;
    cursor: pointer;
    user-select: none;
    transition: var(--transition);
    will-change: transform;
    outline: 0;
    text-decoration: none;
    &:hover,
    &:active {
      transition: var(--transition);
    }
  }
  nav {
    justify-content: space-between;
    display: flex;
    overflow: visible;
    & ul,
    & ol {
      align-items: center;
      padding: 0;
      list-style: none;
      display: flex;
      &:first-of-type {
        margin-left: calc(var(--element-horizontal) * -1);
      }
      & li {
        padding: var(--element-vertical) var(--element-horizontal);
        margin: 0;
        display: inline-block;
      }
    }
  }
  section {
    padding: var(--spacing);
  }
  [data-tooltip] {
    will-change: auto;
    transition: var(--transition);
    position: relative;
    &:not(a, button, input) {
      cursor: help;
      text-decoration: none;
    }
    &[data-placement="top"]:before,
    &:before {
      z-index: 99;
      padding: 0 var(--size-10);
      border-radius: var(--size-5);
      content: attr(data-tooltip);
      border: var(--border-width) solid var(--foreground);
      text-overflow: ellipsis;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      font-size: var(--size-13);
      text-decoration: none;
      display: block;
      position: absolute;
      bottom: 100%;
      left: 50%;
      overflow: hidden;
      transform: translate(-50%, -0.5rem);
    }
    &[data-placement="bottom"]:before {
      top: 100%;
      bottom: auto;
      transform: translate(-50%, 0.25rem);
    }
    &[data-placement="left"]:before {
      inset: 50% 100% auto auto;
      transform: translate(-0.25rem, -50%);
    }
    &[data-placement="right"]:before {
      inset: 50% auto auto 100%;
      transform: translate(0.25rem, -50%);
    }
    &:focus:before,
    &:hover:before {
      opacity: 1;
    }
  }
`;import P from"chroma-js";function I(T,D="shades",$=!0){let L=P(T).shade(0.95),C=P(T).tint(0.6),O=$?P.scale([L,T,C]).colors(11).reverse():P.scale([L,T,C]).colors(11),B={};for(var E in O){let j=O[E]??"#f6f",R;if(E==="0")R=50;else if(E==="10")R=950;else R=parseInt(E)*100;B={...{[`${D}-${R}`]:P(j).css("oklch")},...B}}return B}function m(T){let D=P(T).hex();if(D){let{r:$,g:L,b:C}={r:parseInt(D.substring(0,2),16),g:parseInt(D.substring(2,4),16),b:parseInt(D.substring(4,6),16)};return+((0.2126*$+0.7152*L+0.0722*C)/255*100).toFixed(2)}else return console.error("[luz] Invalid HEX value"),0}function M(T){if(m(T)>60)return P(T).darken(3).css("oklch");else return P(T).brighten(3).css("oklch")}function G(T,D){return P(T).set("oklch.h",D).css("oklch")}function W(T,D){let $={blue:G(T,"270"),sky:G(T,"240"),cyan:G(T,"210"),teal:G(T,"180"),emerald:G(T,"150"),green:G(T,"120"),yellow:G(T,"90"),orange:G(T,"60"),red:G(T,"30"),rose:G(T,"0")},L={};return Object.entries($).map(([C,O],B)=>{L={...{[D?`${D}${C}`:C]:O},...L}}),L}function u(T=16,D=1.31){let $=T/10,L=$*D,C=Math.pow(L,D),O=$*D;if(T>=17)return console.log("BASE",T),L=Math.pow($,2.6),O=Math.pow($,2.6),`clamp(${$.toFixed(1)}rem, ${O.toFixed(2)}cqw, ${L.toFixed(1)}rem)`;return`clamp(${$.toFixed(1)}rem, ${O.toFixed(2)}cqw, ${L.toFixed(1)}rem)`}function _(T,D=2){let $={};for(let L=1;L<=12;L++)$[`size-${L}`]=`${L/10}rem`;for(let L=13;L<=22;L++)$[`size-${L}`]=u(L);return{...$,"border-radius":`${(T/32).toFixed(1)}rem`,"border-width":`${(T/128).toFixed(1)}rem`,spacing:`${(T/10*3).toFixed(0)}rem`,"element-vertical":`${(T/20).toFixed(1)}rem`,"element-horizontal":`${(T/10).toFixed(1)}rem`}}var v={font:"sans-serif","line-height":"130%","font-bold-weight":800,"font-weight":400,"font-monospace":"monospace","font-headings":"sans-serif","font-emphasis":"serif",base:16,power:2,primary:Q.random().hex(),name:"primary",mode:"dark",neutrals:"gray",prefix:"",transition:"all ease 200ms","box-shadow":"none","scale-factor":1,spacing:"5vw"};function f(T){let D={...v,...T},{primary:$,name:L,mode:C,base:O,prefix:B,neutrals:E,power:j,...R}=D,J=O??16,N=L&&L.length>0?L:"primary",K=C==="dark",V=I($,`${B}${N}`,K),U=Q($).set("hsl.h","+180").hex(),S=I(U,`${B}secondary`,K),Y=M(U),q=M($),H=Q($).shade(0.5).desaturate(2.1).hex(),F=I(H,`${B}${E}`,K),y=W($,B);console.log("normalBase",J);let k=_(J,j),A={settings:{name:L,prefix:B,neutrals:E},config:R,colors:{...V,...S,...F,background:`var(--${B}${N}-950)`,foreground:`var(--${B}${N}-50)`,[`on-${B}secondary`]:Y,[`on-${B}${N}`]:q,...y,"element-background":`var(--${B}${E}-950)`,"element-border-color":`var(--${B}${E}-900)`,"element-active-border-color":`var(--${B}${N}-500)`,"element-color":`var(--${B}${N}-100)`,"element-active-color":`var(--${B}${N}-100)`,"element-placeholder-color":`var(--${B}${N}-100)`},sizes:k},w={...A.sizes,...A.config,...A.colors},x=Object.entries(w).map(([z,g])=>{return`
--${z}:${g};`}).join("");return{theme:A,variables:x}}function l(T){let{theme:D,variables:$}=f(T),L=new CSSStyleSheet({media:"all"});L.replaceSync(`
    ${Z}
    ${X(D)}
    :root {
      ${$}
    }
  `),console.log("[luz] \uD83C\uDFD7️ CSS StyleSheet"),document.adoptedStyleSheets=[L],document.addEventListener("DOMContentLoaded",(C)=>{console.log("[luz] \uD83C\uDFD7️ Ready to Show",document.readyState),document.querySelector("body")?.classList.add("luz-loaded")})}export{f as luzGenerator,l as luz};
