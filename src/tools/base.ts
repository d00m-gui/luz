const vars = { neutral: "", primary: "" };

// Every CSS block below is a fully static string — the neutral/primary
// bucket names (which depend on the user's `prefix`/`name`/`neutrals`
// config, known only at `luz()` call time) are written as literal
// placeholder tokens instead of `${}` interpolation. That keeps each block
// valid, parseable CSS on its own, so the `minifyEmbeddedCss` bunup plugin
// (build/minify-embedded-css.ts) can run it through lightningcss at build
// time. The placeholders are swapped for the real names via `substitute()`
// at render time — a couple of cheap string replaces instead of rebuilding
// each template from scratch.
const NEUTRAL_TOKEN = "__LUZ_NEUTRAL__";
const PRIMARY_TOKEN = "__LUZ_PRIMARY__";

function substitute(css: string, v: typeof vars): string {
  return css
    .replaceAll(NEUTRAL_TOKEN, v.neutral)
    .replaceAll(PRIMARY_TOKEN, v.primary);
}

const cardCSS = `
.card {
  container-type: inline-size;
  background: var(--__LUZ_NEUTRAL__-800);
  border-radius: var(--size-8);
  overflow: hidden;
  background-image: linear-gradient(
    5deg,
    var(--__LUZ_NEUTRAL__-700),
    var(--__LUZ_NEUTRAL__-800)
  );
  position: relative;
  .card-content {
    position: relative;
    margin: 0;
    padding: var(--size-16);
    display: flex;
    flex-direction: row;
    flex: 1 1 auto;
    justify-content: space-evenly;
    align-items: center;
  }
}`;

const tabsCSS = `
.tabs {
  border-radius: var(--border-radius);
  .list {
    display: flex;
    position: relative;
    z-index: 0;
    padding: var(--size-5) var(--size-5) 0;
    gap: var(--size-2);
    border-bottom: var(--border);
    border-color: var(--__LUZ_PRIMARY__-500);
  }

  .tab,
  button.tab {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    outline: 0;
    appearance: none;
    user-select: none;
    white-space: nowrap;
    word-break: keep-all;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    background-color: var(--__LUZ_NEUTRAL__-500);
    &[data-active] {
      background-color: var(--__LUZ_PRIMARY__-500);
    }
  }

  .indicator {
    position: absolute;
    z-index: -1;
    left: 0;
    top: 50%;
    translate: var(--active-tab-left) -50%;
    width: var(--active-tab-width);
    height: 1.5rem;
    border-radius: 0.5rem;
    background-color: var(--__LUZ_NEUTRAL__-100);
    transition-property: translate, width;
    transition-duration: 200ms;
    transition-timing-function: ease-in-out;
  }

  .panel {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 0;
    &[hidden] {
      display: none;
    }
  }

  .icon {
    width: var(--size-20);
    height: var(--size-20);
    color: var(--__LUZ_NEUTRAL__-300);
  }
}`;

const avatarCSS = `
    .avatar {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      border-radius: 100%;
      user-select: none;
      font-weight: 500;
      color: var(--__LUZ_NEUTRAL__-900);
      background-color: var(--__LUZ_NEUTRAL__-100);
      font-size: 1rem;
      line-height: 1;
      overflow: hidden;
      height: 3rem;
      width: 3rem;
      .image {
        object-fit: cover;
        height: 100%;
        width: 100%;
      }
      .fallback {
        align-items: center;
        display: flex;
        justify-content: center;
        height: 100%;
        width: 100%;
        font-size: 1rem;
      }
    }`;

const presentationCSS = `
    [role="presentation"] {
      [role="menu"] {
        position: relative;
        left: -30% !important;
      }
    }`;

const menuCSS = `
    [role="menu"] {
      overflow: hidden;
      display: block;
      border-radius: var(--border-radius);
      background-color: var(--__LUZ_NEUTRAL__-950);
      color: var(--__LUZ_NEUTRAL__-100);
      border: var(--border-width) solid var(--border-color);
      transform-origin: var(--transform-origin);
      padding: var(--size-5);
      transition:
        transform 150ms,
        opacity 150ms;
      &[data-starting-style],
      &[data-ending-style] {
        opacity: 0;
        transform: scale(0.9);
      }
      button {
        font-size: var(--size-14);
      }
    }`;

const arrowCSS = `
    .arrow {
      display: flex;
      &[data-side="top"] {
        bottom: -8px;
        rotate: 180deg;
      }
      &[data-side="bottom"] {
        top: -8px;
        rotate: 0deg;
      }
      &[data-side="left"] {
        right: -13px;
        rotate: 90deg;
      }
      &[data-side="right"] {
        left: -13px;
        rotate: -90deg;
      }
    }`;

const ArrowFillCSS = `
    .ArrowFill {
      fill: var(--__LUZ_NEUTRAL__-900);
    }`;

const menubarCSS = `
    [role="menubar"] {
      display: flex;
      padding: var(--size-5);
      gap: var(--size-8);
      background-color: var(--background);
      color: var(--foreground);
      border-radius: var(--border-radius);
      width: min-content;
      margin: 0 auto;
      & > button {
        background-color: transparent;
        color: currentColor;
        padding: var(--size-4) var(--size-8);
        border-radius: calc(var(--border-radius) / 2);
        &[data-pressed] {
          background-color: var(--__LUZ_PRIMARY__-700);
          color: var(--__LUZ_PRIMARY__-400);
        }
        &[disabled] {
          opacity: 0.3;
          cursor: not-allowed;
        }
      }
    }`;

const groupCSS = `
    [role="group"] {
      display: flex;
      flex-direction: row;
      gap: var(--size-8);
      flex-wrap: wrap;
      & > button {
        &[data-pressed] {
          background-color: var(--__LUZ_PRIMARY__-800);
        }
      }
    }`;

const menuitemCSS = `
    div[role="menuitem"],
    div[role="menuitemradio"] {
      display: block;
      outline: 0;
      cursor: default;
      user-select: none;
      padding: var(--size-8);
      position: relative;
      letter-spacing: 0.05rem;
      border-radius: calc(var(--border-radius) / 2);
      font-size: 1.6rem;
      & > span {
        font-size: 1.6rem;
      }
      .indicator {
        opacity: 0.6;
        left: var(--size-10);
        margin-right: 1rem;
      }
      &[data-highlighted] {
        filter: brightness(1.2);
        background-color: var(--__LUZ_PRIMARY__-700) !important;
      }
    }`;

const meterCSS = `
    [role="meter"] {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 0.5rem;
      .label {
        font-weight: 500;
        text-align: left;
      }
      .value {
        grid-column-start: 2;
        margin: 0;
        color: var(--__LUZ_PRIMARY__-500);
        text-align: right;
        font-weight: 800;
      }
      .track {
        grid-column: 1 / 3;
        overflow: hidden;
        background-color: var(--__LUZ_PRIMARY__-950);
        box-shadow: inset 0 0 0 1px var(--__LUZ_PRIMARY__-500);
        height: var(--size-12);
        border-radius: var(--border-radius);
      }
      .indicator {
        background-color: var(--__LUZ_PRIMARY__-500);
        transition: width 500ms;
      }
    }`;

const separatorCSS = `
    .separetor {
      margin: var(--size-5);
      height: var(--size-1);
      background-color: var(--__LUZ_NEUTRAL__-600);
    }`;

const formsCSS = `
    .form {
      display: flex;
      flex-direction: column;
      width: 90%;
      margin: 0 auto;
      gap: var(--size-16);
      & > div {
        container-type: inline-size;
        gap: var(--size-5);
        display: flex;
        flex-direction: column;
      }
      .label {
        margin: 0;
      }
      input {
        flex: 1 1 auto;
      }
      .error {
        text-align: left;
        color: var(--red);
        font-weight: 800;
      }
    }`;

const inputsCSS = `
    input,
    select {
      width: 100%;
      &[type="file"] {
        &::file-selector-button {
          padding: var(--size-5);
          cursor: pointer;
        }
      }
    }`;

const toastCSS = `
    .toast {
      container-type: inline-size;
      --gap: var(--size-8);
      --peek: var(--size-16);
      --scale: calc(max(0, 1 - (var(--toast-index) * 0.1)));
      --shrink: calc(1 - var(--scale));
      --height: var(--toast-frontmost-height, var(--toast-height));
      --offset-y: calc(
        var(--toast-offset-y) * -1 + (var(--toast-index) * var(--gap) * -1) +
          var(--toast-swipe-movement-y)
      );

      position: absolute;
      right: 1rem;
      bottom: 1rem;
      margin: 0 auto;
      box-sizing: border-box;
      background: var(--__LUZ_NEUTRAL__-950);
      color: var(--__LUZ_NEUTRAL__-200);
      border: 1px solid var(--__LUZ_PRIMARY__-800);
      padding: 2rem;
      width: 100%;
      box-shadow: 0 2px 10px rgb(0 0 0 / 0.1);
      background-clip: padding-box;
      border-radius: var(--border-radius);
      transform-origin: bottom center;
      left: auto;
      margin-right: 0;
      -webkit-user-select: none;
      user-select: none;
      transition:
        transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.5s,
        height 0.15s;
      cursor: default;
      z-index: calc(1000 - var(--toast-index));
      height: var(--height);
      max-width: 32rem;
      transform: translateX(var(--toast-swipe-movement-x))
        translateY(
          calc(
            var(--toast-swipe-movement-y) - (var(--toast-index) * var(--peek)) -
              (var(--shrink) * var(--height))
          )
        )
        scale(var(--scale));
      &[data-expanded] {
        transform: translateX(var(--toast-swipe-movement-x))
          translateY(var(--offset-y));
        height: var(--toast-height);
      }
      &[data-starting-style],
      &[data-ending-style] {
        transform: translateY(150%);
      }
      &[data-limited] {
        opacity: 0;
      }
      &[data-ending-style] {
        opacity: 0;
        &[data-swipe-direction="up"] {
          transform: translateY(calc(var(--toast-swipe-movement-y) - 150%));
        }
        &[data-swipe-direction="left"] {
          transform: translateX(calc(var(--toast-swipe-movement-x) - 150%))
            translateY(var(--offset-y));
        }
        &[data-swipe-direction="right"] {
          transform: translateX(calc(var(--toast-swipe-movement-x) + 150%))
            translateY(var(--offset-y));
        }
        &[data-swipe-direction="down"] {
          transform: translateY(calc(var(--toast-swipe-movement-y) + 150%));
        }
      }
      &::after {
        content: "";
        position: absolute;
        top: 100%;
        width: 100%;
        left: 0;
        height: calc(var(--gap) + 1px);
      }
      .content {
        overflow: hidden;
        transition: opacity 0.25s;
        &[data-behind] {
          opacity: 0;
        }
        &[data-expanded] {
          opacity: 1;
        }
      }
      .title {
        margin: 0 0 var(--size-16);
        font-size: var(--size-16);
      }
      .description {
        margin: 0 0 var(--size-16);
        font-size: var(--size-18);
        line-height: 100%;
      }
      .close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: var(--size-5);
        border: none;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.25rem;
        font-size: var(--size-12);
        &:hover {
          color: var(--__LUZ_PRIMARY__-500);
        }
      }
    }`;

const regionCSS = `
    [role="region"] {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }`;

const backdropCSS = `
    .backdrop {
      position: fixed;
      min-height: 100dvh;
      inset: 0;
      background-color: var(--background);
      opacity: 0.6;
      transition: opacity 150ms;
      @supports (-webkit-touch-callout: none) {
        position: absolute;
      }
      &[data-starting-style],
      &[data-ending-style] {
        opacity: 0;
      }
    }`;

const popupCSS = `
    .popup {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0) scale(1);
      width: 50vw;
      max-width: calc(100vw - 3rem);
      background-color: var(--__LUZ_NEUTRAL__-900);
      box-shadow: 0.25rem 0.25rem 0.5ch var(--__LUZ_PRIMARY__-950);
      transition: all 100ms ease-out;
      container-type: inline-size;
      border-radius: var(--border-radius);
      &[data-starting-style] {
        opacity: 0;
        transform: translate3d(-50%, -50%, 0) scale(0);
      }
      .popup-actions, .popup-header {
        display: flex;
        flex-direction: row-reverse;
        padding: 0 0.5ch;
        align-items: flex-end;
        gap: 0.5ch;
      }
       .popup-actions {
         padding: 0.5ch;
       }
      .handle {
        background-color: var(--__LUZ_PRIMARY__-800);
        cursor: grab;
      }
      .title {
        font-size: var(--size-16);
        text-transform: uppercase;
        flex: 1 1 auto;
        padding: var(--element-vertical) var(--element-horizontal);
      }
      .popup-content {
        padding: 1ch;
      }
    }`;

// -- per-`lui`-component CSS ---------------------------------------------
// Keyed by the same names used for `lui.<name>` and for the React 19
// `<style href="<name>" precedence="component">` tag each wrapped component
// renders. One entry per component family that owns markup-scoped CSS;
// families without an entry (button, toggle, switch, ...) rely only on the
// global `setup()`/`reset()` styles and don't need a per-component tag.
export const componentCSS = {
  card: (v: typeof vars) => substitute(cardCSS, v),
  tabs: (v: typeof vars) => substitute(tabsCSS, v),
  avatar: (v: typeof vars) => substitute(avatarCSS, v),
  menu: (v: typeof vars) =>
    substitute(
      presentationCSS + menuCSS + arrowCSS + ArrowFillCSS + menuitemCSS + separatorCSS,
      v,
    ),
  menubar: (v: typeof vars) => substitute(menubarCSS, v),
  togglegroup: (v: typeof vars) => substitute(groupCSS, v),
  meter: (v: typeof vars) => substitute(meterCSS, v),
  form: () => formsCSS,
  field: () => inputsCSS,
  toast: (v: typeof vars) => substitute(toastCSS, v) + regionCSS,
  dialog: (v: typeof vars) => backdropCSS + substitute(popupCSS, v),
};

// -- main --------------------------------------------------------------------

export const base = (tokens?: any): string => {
  const v = {
    neutral: `${tokens.settings.prefix}${tokens.settings.neutrals}`,
    primary: `${tokens.settings.prefix}${tokens.settings.name}`,
  };

  return Object.values(componentCSS)
    .map((css) => css(v))
    .join("\n");
};
