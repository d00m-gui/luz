import { defineCollection } from "astro:content";
import { z } from "astro/zod";
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

const components = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/components" }),
  schema: z.object({
    title: z.string(),
    desc: z.string().optional(),
    category: z.enum([
      "Overlays",
      "Feedback",
      "Navigation",
      "Layout",
      "Primitives",
      "Surfaces",
      "Data",
      "Identity",
    ]),
    covers: z.array(z.string()),
    preview: z.string().optional(),
    span: z.union([z.literal(2), z.literal(3)]).optional(),
    wip: z.boolean().optional(),
    variants: z
      .array(
        z.object({
          title: z.string(),
          desc: z.string().optional(),
          html: z.string(),
          preview: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { features, components };
