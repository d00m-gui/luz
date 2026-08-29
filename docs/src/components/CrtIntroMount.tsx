import { useEffect, useRef, useState } from "react";
import { CrtDockedOverlay, CrtIntro, type CrtIntroMode } from "./CrtIntro";

const SEEN_KEY = "luz-intro-seen";
const TITLE_SUFFIX_RE = /\s*—\s*luz docs\s*$/;

interface Entry {
  key: number;
  mode: CrtIntroMode;
  sectionName?: string;
  hue?: string;
}

function currentSectionName(): string | undefined {
  return document.title.replace(TITLE_SUFFIX_RE, "").trim() || undefined;
}

export function CrtIntroMount() {
  const [entry, setEntry] = useState<Entry | null>(null);
  // El burst (intro o transition) termina posando el logo en la esquina —
  // a partir de ahí el badge persistente queda montado para siempre.
  const [docked, setDocked] = useState(false);
  const [sectionName, setSectionName] = useState<string | undefined>();
  const nextKey = useRef(0);

  useEffect(() => {
    setSectionName(currentSectionName());
    if (sessionStorage.getItem(SEEN_KEY)) {
      setDocked(true);
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    setEntry({ key: nextKey.current++, mode: "intro" });
  }, []);

  useEffect(() => {
    const onBeforeSwap = (event: Event) => {
      const newDocument = (event as Event & { newDocument?: Document }).newDocument;
      const title = newDocument?.title.replace(TITLE_SUFFIX_RE, "").trim();
      const hue = newDocument?.documentElement.dataset.hue;
      setSectionName(title || undefined);
      setEntry({
        key: nextKey.current++,
        mode: "transition",
        sectionName: title || undefined,
        hue,
      });
    };
    document.addEventListener("astro:before-swap", onBeforeSwap);
    return () => document.removeEventListener("astro:before-swap", onBeforeSwap);
  }, []);

  return (
    <>
      {docked && <CrtDockedOverlay sectionName={sectionName} />}
      {entry && (
        <CrtIntro
          key={entry.key}
          mode={entry.mode}
          sectionName={entry.sectionName}
          hue={entry.hue}
          onDone={() => {
            setEntry(null);
            setDocked(true);
          }}
        />
      )}
    </>
  );
}
