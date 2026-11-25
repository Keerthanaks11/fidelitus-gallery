import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend-only site: no backend proxy needed.
export default defineConfig({
  plugins: [react()],
});
