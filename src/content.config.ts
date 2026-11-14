import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.number().int(),
    role: z.string(),
    team: z.string().optional(),
    stack: z.array(z.string()).default([]),
    /** short label shown in project lists, e.g. "azure · networking" */
    area: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    draft: z.boolean().default(false),
    /** key in src/data/diagrams.ts, shown with the project on the home page */
    diagram: z.string().optional(),
    star: z
      .object({
        situation: z.string(),
        task: z.string(),
        action: z.string(),
        result: z.string(),
      })
      .optional(),
  }),
});

export const collections = { projects };
