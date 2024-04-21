import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://ali-astro-blog.netlify.app/",
  integrations: [
    preact({
      include: ["src/components/preact/**/*"],
    }),
    mdx(),
    react({
      include: ["src/components/react/**/*"],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
