import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
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

const playgrounds = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/playgrounds" }),
});

export const collections = { components, playgrounds };
