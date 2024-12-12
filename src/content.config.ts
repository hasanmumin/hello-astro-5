import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

export type Country = {
  name: {
    common: string;
  };
  cca3: string;
  flag: string;
  population: number;
  capital: string[];
};

const blog = defineCollection({
  // Load data from Markdown files on disk
  loader: glob({ pattern: "**/*.md", base: "./src/data/blog" }),
  schema: z.object({
    /* optionally define a schema for type-safe data */
  }),
});

const countries = defineCollection({
  // Load data from anywhere!
  loader: async () => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = (await response.json()) as Country[];
  
    // Must return an array of entries with an id property, or an object with IDs as keys and entries as values
    return data.map((country) => ({
      id: country.cca3,
      ...country,
    }));
  },
});

export const collections = { blog, countries };
