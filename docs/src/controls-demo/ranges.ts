export function mountRanges(root: HTMLElement, signal: AbortSignal) {
  for (const surface of root.querySelectorAll<HTMLElement>(
    ".knob-dial, .fader-control",
  )) {
    const control = surface.closest<HTMLElement>(".knob, .fader")!;
    const slider = surface.matches(".knob-dial")
      ? surface
      : surface.querySelector<HTMLElement>('[role="slider"]')!;
    const legends = [...control.querySelectorAll<HTMLElement>(".knob-legend")];
    const range = document.createElement("input");
    range.type = "range";
    range.min = "0";
    range.max = legends.length ? String(legends.length - 1) : "100";
    range.step = "1";
    range.value = legends.length
      ? String(
          Math.max(
            0,
            legends.findIndex((el) => el.dataset.active === "true"),
          ),
        )
      : (slider.getAttribute("aria-valuenow") ?? "0");
    range.setAttribute(
      "aria-label",
      slider.getAttribute("aria-label") ?? "Value",
    );
    range.disabled = !!control.closest("[data-disabled]");
    range.dataset.demoRange = "";
    slider.removeAttribute("role");
    slider.removeAttribute("tabindex");
    slider.removeAttribute("aria-valuenow");
    slider.removeAttribute("aria-valuetext");
    slider.removeAttribute("aria-label");
    surface.classList.add("demo-range-surface");
    surface.append(range);

    const update = () => {
      const value = range.valueAsNumber;
      const fraction = value / Number(range.max);
      if (surface.matches(".knob-dial")) {
        surface.style.setProperty(
          "--knob-angle",
          `${-135 + fraction * 270}deg`,
        );
      } else {
        control.style.setProperty("--fader-value", String(fraction));
      }
      const output = control.querySelector<HTMLElement>(
        ".knob-readout, .fader-readout",
      );
      if (output)
        output.textContent = `${value}${range.getAttribute("aria-label") === "Shields" ? "%" : ""}`;
      legends.forEach((legend, index) => {
        legend.dataset.active = String(index === value);
      });
      if (legends.length)
        range.setAttribute(
          "aria-valuetext",
          legends[value]!.textContent!.trim(),
        );
      root.dispatchEvent(new CustomEvent("controls:change"));
    };
    range.addEventListener("input", update, { signal });
    update();
    surface.addEventListener(
      "wheel",
      (event) => {
        if (range.disabled || event.ctrlKey || event.deltaY === 0) return;
        event.preventDefault();
        if (event.deltaY < 0) range.stepUp();
        else range.stepDown();
        update();
      },
      { passive: false, signal },
    );

    let pointer: number | undefined;
    let startY = 0;
    let startValue = 0;
    const move = (event: PointerEvent) => {
      if (surface.matches(".knob-dial")) {
        range.value = String(
          startValue +
            (((startY - event.clientY) / 2) * Number(range.max)) / 100,
        );
      } else {
        const track = control
          .querySelector<HTMLElement>(".fader-track")!
          .getBoundingClientRect();
        const horizontal = control.classList.contains("horizontal");
        range.value = String(
          (horizontal
            ? (event.clientX - track.left) / track.width
            : (track.bottom - event.clientY) / track.height) * 100,
        );
      }
      update();
    };
    surface.addEventListener(
      "pointerdown",
      (event) => {
        if (range.disabled || event.button !== 0) return;
        event.preventDefault();
        range.focus({ preventScroll: true });
        pointer = event.pointerId;
        startY = event.clientY;
        startValue = range.valueAsNumber;
        surface.setPointerCapture(pointer);
        slider.dataset.dragging = "";
        if (!surface.matches(".knob-dial")) move(event);
      },
      { signal },
    );
    surface.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerId === pointer) move(event);
      },
      { signal },
    );
    const finish = () => {
      pointer = undefined;
      delete slider.dataset.dragging;
    };
    surface.addEventListener("lostpointercapture", finish, { signal });
    surface.addEventListener("pointerup", finish, { signal });
    surface.addEventListener("pointercancel", finish, { signal });
    legends.forEach((legend, index) => {
      legend.addEventListener(
        "click",
        () => {
          if (range.disabled) return;
          range.value = String(index);
          update();
          range.focus({ preventScroll: true });
        },
        { signal },
      );
    });
  }
}
