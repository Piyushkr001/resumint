import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './config/schema.tsx',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_wsYz2eaB8iPR@ep-still-block-a8djb4kn-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
});
