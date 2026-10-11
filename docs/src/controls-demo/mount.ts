import { mountRanges } from "./ranges";

let lifecycle: AbortController | undefined;

export function mountControlsDemos() {
  lifecycle?.abort();
  lifecycle = new AbortController();
  const signal = lifecycle.signal;
  for (const root of document.querySelectorAll<HTMLElement>(
    "[data-controls-demo]",
  )) {
    mountRanges(root, signal);
    for (const group of root.querySelectorAll<HTMLElement>(
      '[role="radiogroup"]',
    )) {
      const options = [
        ...group.querySelectorAll<HTMLButtonElement>('[role="radio"]'),
      ];
      const select = (selected: HTMLButtonElement) => {
        options.forEach((option) => {
          option.setAttribute("aria-checked", String(option === selected));
          option.tabIndex = option === selected ? 0 : -1;
        });
        root.dispatchEvent(new CustomEvent("controls:change"));
      };
      options.forEach((option, index) => {
        option.tabIndex =
          option.getAttribute("aria-checked") === "true" ? 0 : -1;
        option.addEventListener("click", () => select(option), { signal });
        option.addEventListener(
          "keydown",
          (event) => {
            let next: number;
            if (event.key === "Home") next = 0;
            else if (event.key === "End") next = options.length - 1;
            else if (event.key === "ArrowRight" || event.key === "ArrowDown")
              next = (index + 1) % options.length;
            else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
              next = (index + options.length - 1) % options.length;
            else return;
            event.preventDefault();
            select(options[next]!);
            options[next]!.focus();
          },
          { signal },
        );
      });
    }
    for (const button of root.querySelectorAll<HTMLButtonElement>(
      ".toggle-switch-body, .led-button",
    )) {
      if (button.matches(".toggle-switch-body")) {
        button.setAttribute(
          "aria-label",
          button
            .closest(".toggle-switch")!
            .querySelector(".control-label")!
            .textContent!.trim(),
        );
      }
      button.disabled ||= !!button.closest("[data-disabled]");
      button.addEventListener(
        "click",
        () => {
          if (button.closest("[data-disabled]")) return;
          const attribute = button.matches(".toggle-switch-body")
            ? "aria-checked"
            : "aria-pressed";
          const row = button.closest(".mfd-keys");
          if (row && !row.classList.contains("bottom")) {
            row
              .querySelectorAll("button")
              .forEach((key) =>
                key.setAttribute("aria-pressed", String(key === button)),
              );
          } else {
            button.setAttribute(
              attribute,
              String(button.getAttribute(attribute) !== "true"),
            );
          }
          root.dispatchEvent(new CustomEvent("controls:change"));
        },
        { signal },
      );
    }
    for (const mfd of root.querySelectorAll<HTMLElement>(".mfd")) {
      const screen = mfd.querySelector<HTMLElement>(".mfd-screen")!;
      const views = [...screen.children];
      const status = document.createElement("output");
      status.className = "readout demo-mfd-status";
      status.setAttribute("aria-live", "polite");
      screen.append(status);
      let view = "Nav";
      const render = () => {
        status.replaceChildren();
        const title = document.createElement("span");
        title.className = "readout-caption";
        title.textContent = view;
        status.append(title);
        const controls = [
          ...root.querySelectorAll<HTMLInputElement>("[data-demo-range]"),
        ];
        const mode =
          root
            .querySelector('[role="radio"][aria-checked="true"]')
            ?.textContent?.trim() ?? "Nav";
        const power =
          root
            .querySelector('[role="switch"]')
            ?.getAttribute("aria-checked") !== "false";
        const text =
          view === "Comms"
            ? "Channel 1 · Ready"
            : view === "Scan"
              ? `Mode ${mode} · ${controls.find((input) => input.getAttribute("aria-label") === "Gain")?.value ?? "0"}% gain`
              : view === "Menu"
                ? "Nav · Scan · Comms · Power"
                : controls
                    .map(
                      (input) =>
                        `${input.getAttribute("aria-label")}: ${input.getAttribute("aria-valuetext") ?? input.value}`,
                    )
                    .join(" · ");
        const value = document.createElement("span");
        value.className = "readout-value";
        value.textContent = `${power ? "ON" : "OFF"} · ${text || "Ready"}`;
        status.append(value);
        views.forEach((child) => {
          (child as HTMLElement).hidden = view !== "Nav";
        });
      };
      for (const key of mfd.querySelectorAll<HTMLButtonElement>(
        ".mfd-keys button",
      )) {
        key.addEventListener(
          "click",
          () => {
            const label = key.textContent!.trim();
            view = label === "Home" || label === "Back" ? "Nav" : label;
            const top = [
              ...mfd.querySelectorAll<HTMLButtonElement>(
                ".mfd-keys.top button",
              ),
            ];
            top.forEach((button) =>
              button.setAttribute(
                "aria-pressed",
                String(button.textContent!.trim() === view),
              ),
            );
            render();
          },
          { signal },
        );
      }
      root.addEventListener("controls:change", render, { signal });
      render();
    }
  }
}
