import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";
import { extractAnnotations } from "./lib/extract-annotations";

const annotationsLoader: Loader = {
  name: "luz-annotations-loader",
  load: async ({ store }) => {
    // This is a full-refresh loader (re-parses the parent repo's source on
    // every run), not an incremental one — clear the store first or an
    // entry that `extractAnnotations()` stops producing (a removed
    // export/hook) lingers forever in the persisted `data-store.json`
    // cache, surviving even a source change until someone deletes it by
    // hand.
    store.clear();
    for (const entry of extractAnnotations()) {
      store.set({ id: entry.id, data: entry });
    }
  },
};

const components = defineCollection({ loader: annotationsLoader });

const playgrounds = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/playgrounds" }),
});

export const collections = { components, playgrounds };
