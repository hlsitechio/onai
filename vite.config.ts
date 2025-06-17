
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Conditional import for lovable-tagger to handle version conflicts
let componentTagger: any = null;
try {
  const taggerModule = await import("lovable-tagger");
  componentTagger = taggerModule.componentTagger;
} catch (error: any) {
  console.warn("lovable-tagger could not be loaded:", error?.message || "Unknown error");
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/tmp/**',
        '**/temp/**',
        '**/*.log',
        '**/.DS_Store',
        '**/Thumbs.db',
        '**/supabase/functions/**',
        '**/public/sw.js',
        '**/public/sw-*.js'
      ],
      usePolling: false,
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Ensure single React instance
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          editor: [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/core',
            '@tiptap/extension-link',
            '@tiptap/extension-image',
            '@tiptap/extension-table'
          ],
          ui: [
            '@radix-ui/react-tabs',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            '@radix-ui/react-dropdown-menu'
          ],
          charts: ['recharts'],
          ocr: ['tesseract.js'],
          supabase: ['@supabase/supabase-js'],
          utils: ['date-fns', 'clsx', 'class-variance-authority']
        },
        chunkFileNames: (chunkInfo) => {
          return `assets/[name]-[hash].js`;
        }
      }
    },
    target: 'es2020',
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug']
      }
    } : undefined,
    chunkSizeWarningLimit: 500
  },
  optimizeDeps: {
    exclude: ['lovable-tagger'],
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@radix-ui/react-tabs',
      '@radix-ui/react-slot'
    ],
    // Force pre-bundling of React
    force: true,
  },
  define: {
    global: 'globalThis',
  },
}));
