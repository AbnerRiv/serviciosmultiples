import { defineConfig, envField } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  experimental: {
    env:{
      schema:{
        PUBLIC_API_URL: envField.string({
          context: 'client',
          access: 'public',
          default:'http://localhost:5097/api/'
        })
      }
    }
  }
});