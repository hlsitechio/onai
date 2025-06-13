
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only load lovable-tagger in development to avoid peer dependency conflicts in production
    ...(mode === 'development' ? [
      (async () => {
        try {
          const { componentTagger } = await import("lovable-tagger");
          return componentTagger();
        } catch (error) {
          console.warn("lovable-tagger not available:", error);
          return null;
        }
      })()
    ] : [])
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
