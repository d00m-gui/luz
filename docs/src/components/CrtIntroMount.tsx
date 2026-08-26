import { useEffect, useRef, useState } from "react";
import { CrtIntro, type CrtIntroMode } from "./CrtIntro";

const SEEN_KEY = "luz-intro-seen";
const TITLE_SUFFIX_RE = /\s*—\s*luz docs\s*$/;

interface Entry {
  key: number;
  mode: CrtIntroMode;
  sectionName?: string;
}

export function CrtIntroMount() {
  const [entry, setEntry] = useState<Entry | null>(null);
  const nextKey = useRef(0);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    setEntry({ key: nextKey.current++, mode: "intro" });
  }, []);

  useEffect(() => {
    const onBeforeSwap = (event: Event) => {
      const newDocument = (event as Event & { newDocument?: Document }).newDocument;
      const title = newDocument?.title.replace(TITLE_SUFFIX_RE, "").trim();
      setEntry({ key: nextKey.current++, mode: "transition", sectionName: title || undefined });
    };
    document.addEventListener("astro:before-swap", onBeforeSwap);
    return () => document.removeEventListener("astro:before-swap", onBeforeSwap);
  }, []);

  if (!entry) return null;

  return (
    <CrtIntro
      key={entry.key}
      mode={entry.mode}
      sectionName={entry.sectionName}
      onDone={() => setEntry(null)}
    />
  );
}
