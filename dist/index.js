import $ from"chroma-js";function u(t){let{name:r,prefix:e,neutrals:o}={...t.settings};return`
    a {
      color: var(--anchor, var(--${e}blue));
    }
    hr {
      background: var(--${e}${r});
      color: var(--${e}${r});
    }
    kbd {
      border: var(--border-width) solid var(--${e}${r}-900);
      background-color: var(--${e}${r}-500);
      box-shadow:
        inset 0 0 5px var(--size-5) var(--${e}${r}-300),
        inset 0 -1rem 5px 2px var(--${e}${r}-500),
        0 0 0 1px var(--${e}${r}-100);
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
      background-color: var(--${e}${r}-500);
    }
    label[for="file"],
    &[role="file"],
    &[file-] {
      input[type="file"] {
        &::file-selector-button {
          border-top: var(--border-width) solid var(--${e}${r}-200);
        }
      }
    }
    input[type="range"] {
      background-color: var(--${e}${o}-500);
      box-shadow: inset 0 0 0 var(--border-width) var(--${e}${o}-600);
      &:active {
        &::-webkit-slider-thumb,
        &::-moz-range-thumb {
          background: var(--${e}${r}-500);
        }
      }
    }
    [type="checkbox"],
    [type="radio"],
    [type="range"],
    progress {
      accent-color: var(--${e}${r}-500);
    }
    [type="checkbox"],
    [type="radio"] {
      color: var(--${e}${r}-100);
      &:checked {
        background-color: var(--${e}${r}-500);
        border-color: var(--${e}${r}-200);
      }
    }
    [type="checkbox"][role="switch"] {
      &::before {
        background-color: var(--${e}${r}-500);
      }
      &:checked {
        background-color: var(--${e}${r}-500);
      }
    }
    [type="radio"] {
      &::before {
        background-color: var(--${e}-secondary-500);
      }
      &:checked {
        background-color: var(--${e}${r}-500);
        border-color: var(--${e}${r}-500);
      }
    }
    blockquote {
      border-left: 0.25rem solid var(--${e}${r}-200);
      border-inline-start: 0.25rem solid var(--${e}${r}-200);
      footer {
        color: var(--${e}${r}-500);
      }
    }
    button[type="submit"],
    [role="button"],
    [type="button"],
    [type="file"]::file-selector-button,
    [type="reset"],
    [type="submit"],
    button {
      background-color: var(--${e}${r}-500);
      color: var(--on-${e}${r});
      &[role="secondary"],
      &[role="alternative"] {
        background-color: var(--${e}secondary-500);
        color: var(--on-${e}secondary);
      }
      &[type="reset"],
      &[role="cancel"] {
        background-color: var(--${e}blue);
      }
      &[role="apply"] {
        background-color: var(--${e}green);
      }
      &[role="contrast"] {
        background-color: var(--foreground);
        color: var(--background);
      }
    }
    input[aria-invalid="false"] {
      border-color: var(--${e}green);
      color: var(--${e}green);
      &::placeholder {
        color: var(--${e}green);
      }
    }
    input[aria-invalid="true"] {
      border-color: var(--${e}red);
      color: var(--${e}red);
      &::placeholder {
        color: var(--${e}red);
      }
    }
    [data-tooltip] {
      &[data-placement="top"]::before,
      &::before {
        background: var(--${e}${r}-900);
        color: var(--${e}${r}-100);
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
  `}var m=`
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
`;import c from"chroma-js";function h(t,r="shades",e=!0){let o=c(t).shade(0.95),n=c(t).tint(0.6),i=e?c.scale([o,t,n]).colors(11).reverse():c.scale([o,t,n]).colors(11),a={};for(var l in i){let v=i[l]??"#f6f",b;if(l==="0")b=50;else if(l==="10")b=950;else b=parseInt(l)*100;a={...{[`${r}-${b}`]:c(v).css("oklch")},...a}}return a}function G(t){let r=c(t).hex();if(r){let{r:e,g:o,b:n}={r:parseInt(r.substring(0,2),16),g:parseInt(r.substring(2,4),16),b:parseInt(r.substring(4,6),16)};return+((0.2126*e+0.7152*o+0.0722*n)/255*100).toFixed(2)}else return console.error("[luz] Invalid HEX value"),0}function y(t){if(G(t)>60)return c(t).darken(3).css("oklch");else return c(t).brighten(3).css("oklch")}function s(t,r){return c(t).set("oklch.h",r).css("oklch")}function k(t,r){let e={blue:s(t,"270"),sky:s(t,"240"),cyan:s(t,"210"),teal:s(t,"180"),emerald:s(t,"150"),green:s(t,"120"),yellow:s(t,"90"),orange:s(t,"60"),red:s(t,"30"),rose:s(t,"0")},o={};return Object.entries(e).map(([n,i],a)=>{o={...{[r?`${r}${n}`:n]:i},...o}}),o}function N(t=16,r=1.31){let e=t/10,o=e*r,n=Math.pow(o,r),i=e*r;if(t>=17)return console.log("BASE",t),o=Math.pow(e,2.6),i=Math.pow(e,2.6),`clamp(${e.toFixed(1)}rem, ${i.toFixed(2)}cqw, ${o.toFixed(1)}rem)`;return`clamp(${e.toFixed(1)}rem, ${i.toFixed(2)}cqw, ${o.toFixed(1)}rem)`}function z(t,r=2){let e={};for(let o=1;o<=12;o++)e[`size-${o}`]=`${o/10}rem`;for(let o=13;o<=22;o++)e[`size-${o}`]=N(o);return{...e,"border-radius":`${(t/32).toFixed(1)}rem`,"border-width":`${(t/128).toFixed(1)}rem`,spacing:`${(t/10*3).toFixed(0)}rem`,"element-vertical":`${(t/20).toFixed(1)}rem`,"element-horizontal":`${(t/10).toFixed(1)}rem`}}var P={font:"sans-serif","line-height":"130%","font-bold-weight":800,"font-weight":400,"font-monospace":"monospace","font-headings":"sans-serif","font-emphasis":"serif",base:16,power:2,primary:$.random().hex(),name:"primary",mode:"dark",neutrals:"gray",prefix:"",transition:"all ease 200ms","box-shadow":"none","scale-factor":1,spacing:"5vw"};function x(t){let r={...P,...t},{primary:e,name:o,mode:n,base:i,prefix:a,neutrals:l,power:v,...b}=r,g=i??16,d=o&&o.length>0?o:"primary",f=n==="dark",q=h(e,`${a}${d}`,f),w=$(e).set("hsl.h","+180").hex(),C=h(w,`${a}secondary`,f),D=y(w),Y=y(e),T=$(e).shade(0.5).desaturate(2.1).hex(),E=h(T,`${a}${l}`,f),L=k(e,a);console.log("normalBase",g);let j=z(g,v),p={settings:{name:o,prefix:a,neutrals:l},config:b,colors:{...q,...C,...E,background:`var(--${a}${d}-950)`,foreground:`var(--${a}${d}-50)`,[`on-${a}secondary`]:D,[`on-${a}${d}`]:Y,...L,"element-background":`var(--${a}${l}-950)`,"element-border-color":`var(--${a}${l}-900)`,"element-active-border-color":`var(--${a}${d}-500)`,"element-color":`var(--${a}${d}-100)`,"element-active-color":`var(--${a}${d}-100)`,"element-placeholder-color":`var(--${a}${d}-100)`},sizes:j},B={...p.sizes,...p.config,...p.colors},O=Object.entries(B).map(([R,_])=>{return`
--${R}:${_};`}).join("");return{theme:p,variables:O}}function U(t){let{theme:r,variables:e}=x(t),o=new CSSStyleSheet({media:"all"});o.replaceSync(`
    ${m}
    ${u(r)}
    :root {
      ${e}
    }
  `),console.log("[luz] \uD83C\uDFD7️ CSS StyleSheet"),document.adoptedStyleSheets=[o],document.addEventListener("DOMContentLoaded",(n)=>{console.log("[luz] \uD83C\uDFD7️ Ready to Show",document.readyState),document.querySelector("body")?.classList.add("luz-loaded")})}function X(t){let{theme:r,variables:e}=x(t),o=document.createElement("style"),n=`
    ${m}
    ${u(r)}
    body {
      ${e}
    }
  `;return o.textContent=n,document.head.appendChild(o),n}export{x as luzGenerator,X as luzCSS,U as luz};
