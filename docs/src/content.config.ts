import { defineCollection } from "astro:content";
import type { Loader } from "astro/loaders";
import { extractAnnotations } from "./lib/extract-annotations";

const annotationsLoader: Loader = {
  name: "luz-annotations-loader",
  load: async ({ store }) => {
    for (const entry of extractAnnotations()) {
      store.set({ id: entry.id, data: entry });
    }
  },
};

const components = defineCollection({ loader: annotationsLoader });

export const collections = { components };
