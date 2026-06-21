var n = (i) => {
  let { name: e, prefix: r, neutrals: t } = { ...i.settings },
    a = `${r}${t}`,
    o = `${r}${e}`;
  return `
		/* Card */
		.card {
			container-type: inline-size;
			background: var(--${a}-800);
			border-radius: var(--size-8);
			overflow: hidden;
			background-image: linear-gradient(
				5deg,
				var(--${a}-700),
				var(--${a}-800)
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
		}

		/* TABS */
		.tabs {
			border-radius: var;
			.list {
				display: flex;
				position: relative;
				z-index: 0;
				padding: var(--size-5) var(--size-5) 0;
				gap: var(--size-2);
				border-bottom: var(--border);
				border-color: var(--${o}-500);
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
				background-color: var(--${a}-500);
				&[data-active] {
					background-color: var(--${o}-500);
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
				background-color: var(--${a}-100);
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
				color: var(--${a}-300);
			}
		}
		/* AVATAR */
		.avatar {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			vertical-align: middle;
			border-radius: 100%;
			user-select: none;
			font-weight: 500;
			color: var(--${a}-900);
			background-color: var(--${a}-100);
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
		}

		/* Presentation */
		[role="presentation"] {
			[role="menu"] {
				position: relative;
				left: -30% !important;
			}
		}
		/* Menu a.k.a Popup */
		[role="menu"] {
			overflow: hidden;
			display: block;
			border-radius: var(--border-radius);
			background-color: var(--${a}-950);
			color: var(--${a}-100);
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
		}
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
		}
		.ArrowFill {
		fill: var(--${a}-900);
		}

		/* Menubar */
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
					background-color: var(--${o}-700);
					color: var(--${o}-400);
				}
				&[disabled] {
					opacity: 0.3;
					cursor: not-allowed;
				}
			}
		}
		[role="group"] {
			display: flex;
			flex-direction: row;
			gap: var(--size-8);
			flex-wrap: wrap;
			& > button {
				&[data-pressed] {
					background-color: var(--${o}-300);
					color: var(--${o}-600);
				}
			}
		}
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
				background-color: var(--${o}-700) !important;
			}
		}

		/*METER*/
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
				color: var(--${o}-500);
				text-align: right;
				font-weight: 800;
			}
			.track {
				grid-column: 1 / 3;
				overflow: hidden;
				background-color: var(--${o}-950);
				box-shadow: inset 0 0 0 1px var(--${o}-500);
				height: var(--size-12);
				border-radius: var(--border-radius);
			}
			.indicator {
				background-color: var(--${o}-500);
				transition: width 500ms;
			}
		}
		.separetor {
			margin: var(--size-5);
			height: var(--size-1);
			background-color: var(--${a}-600);
		}

		/* Forms */
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
		}
		input,
		select {
			width: 100%;
			&[type="file"] {
				&::file-selector-button {
					padding: var(--size-5);
					cursor: pointer;
				}
			}
		}
		/* Toast */
		.toast {
			container-type: inline-size;
			--toast-height: 30vh;
			--gap: var(--size-16);
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
			background: var(--${a}-950);
			color: var(--${a}-200);
			border: 1px solid var(--${o}-800);
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
				color: var(--${o}-500);
				}
			}
		}
		/* fixed region notifications */
		[role="region"] {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
		}
	`;
};
function l(i) {
  let { name: e, prefix: r, neutrals: t } = { ...i.settings };
  return `
    a {
      color: var(--anchor, var(--${r}blue));
      &.secondary {
      	--anchor: var(--${r}secondary-500);
      }
      &.contrast {
      	--anchor: var(--${r}${t}-500);
      }
      &.danger {
      	--anchor: var(--${r}red);
      }
      &.success {
      	--anchor: var(--${r}emerald);
      }
      &.warning {
      	--anchor: var(--${r}yellow);
      }
    }
    hr {
      background: var(--${r}${e});
      color: var(--${r}${e});
    }
    kbd {
      border: var(--border-width) solid var(--${r}${e}-900);
      background-color: var(--${r}${e}-500);
      color: var(--on-${r}${e});
      box-shadow:
        inset 0 0 var(--size-3) var(--size-3) var(--${r}${e}-300),
        inset 0 -1rem var(--size-5) var(--size-2) var(--${r}${e}-600),
        0 0 0 var(--size-1) var(--${r}${e}-600);
    }
    table {
      tr:hover {
        background-color: var(--${r}${e}-800);
        color: var(--${r}${e}-300);
      }
      th {
        background-color: var(--element-background);
      }
    }
    mark,
    &::selection, &::-moz-selection {
      background-color: var(--${r}${e}-500);
      color: var(--on-${r}${e});
      outline: 3px solid var(--${r}${e}-500);
    }
    label[for="file"],
    &[role="file"],
    &[file-] {
      input[type="file"] {
        &::file-selector-button {
          border-top: var(--border-width) solid var(--${r}${e}-200);
        }
      }
    }
    input[type="range"] {
      background-color: var(--${r}${t}-900);
      box-shadow: inset 0 0 0 var(--border-width) var(--${r}${t}-600);
      &:active {
        &::-webkit-slider-thumb,
        &::-moz-range-thumb {
          background: var(--${r}${e}-500);
        }
      }
    }
    [type="checkbox"],
    [type="radio"],
    [type="range"],
    progress {
      accent-color: var(--${r}${e}-500);
    }
    [type="checkbox"],
    [type="radio"] {
      color: var(--${r}${e}-100);
      &:checked {
        background-color: var(--${r}${e}-500);
        border-color: var(--${r}${e}-200);
      }
    }
    [type="checkbox"][role="switch"] {
      &::before {
        background-color: var(--${r}${e}-500);
      }
      &:checked {
        background-color: var(--${r}${e}-500);
      }
    }
    [type="radio"] {
      &::before {
        background-color: var(--${r}-secondary-500);
      }
      &:checked {
        background-color: var(--${r}${e}-500);
        border-color: var(--${r}${e}-500);
      }
    }
    blockquote {
      border-left: 0.25rem solid var(--${r}${e}-200);
      border-inline-start: 0.25rem solid var(--${r}${e}-200);
      footer {
        color: var(--${r}${e}-500);
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
      background-color: var(--${r}${e}-500);
      color: var(--on-${r}${e});
      &[role="secondary"],
      &[role="alternative"] {
        background-color: var(--${r}secondary-500);
        color: var(--on-${r}secondary);
      }
      &[type="reset"],
      &[role="cancel"], &.cancel, &.reset {
        background-color: var(--${r}${t}-500);
      }
      &[role="apply"], &.apply, &.success {
        background-color: var(--${r}green);
      }
      &[role="contrast"], &.contrast {
        background-color: var(--foreground);
        color: var(--background);
      }
      &.danger {
      	background-color: var(--${r}red);
      }
      &.warning {
        background-color: var(--${r}yellow);
      }
      &.ghost {
        background-color: transparent;
        color: var(--${r}${e}-400);
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
      border-color: var(--${r}green);
      color: var(--${r}green);
      &::placeholder {
        color: var(--${r}green);
      }
    }
    input[aria-invalid="true"] {
      border-color: var(--${r}red);
      color: var(--${r}red);
      &::placeholder {
        color: var(--${r}red);
      }
    }
    [data-tooltip] {
      &[data-placement="top"]::before,
      &::before {
        background: var(--${r}${e}-900);
        color: var(--${r}${e}-100);
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
export { n as c, l as d };
