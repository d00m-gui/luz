import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const features = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/features" }),
  schema: z.object({
    title: z.string(),
    fields: z.array(z.string()),
    order: z.number().default(0),
    examples: z
      .array(
        z.object({
          label: z.string(),
          lang: z.string().default("ts"),
          code: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { features };
