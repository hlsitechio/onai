
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Conditional import for lovable-tagger with better error handling
let componentTagger: any = null;
try {
  // Try to import lovable-tagger, but handle version conflicts gracefully
  const taggerModule = await import("lovable-tagger");
  componentTagger = taggerModule.componentTagger;
} catch (error: any) {
  // Handle the specific vite version conflict error more gracefully
  if (process.env.NODE_ENV === 'development') {
    if (error?.message?.includes('peer dep') || error?.message?.includes('ERESOLVE')) {
      console.warn("lovable-tagger has a vite version conflict - skipping component tagging");
    } else {
      console.warn("lovable-tagger could not be loaded:", error?.message || "Unknown error");
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: process.cwd(),
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
    // Only use componentTagger if it loaded successfully and we're in development
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
    // Basic deduplication for React
    dedupe: [
      'react', 
      'react-dom'
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
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
        pure_funcs: ['console.log', 'console.debug', 'console.info']
      },
      mangle: {
        keep_fnames: false
      }
    } : undefined,
    chunkSizeWarningLimit: 500
  },
  optimizeDeps: {
    exclude: ['lovable-tagger'],
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'lucide-react',
      '@radix-ui/react-tabs',
      '@radix-ui/react-slot',
      '@radix-ui/react-tooltip',
      'loglevel'
    ],
    // Force pre-bundling to resolve version conflicts
    force: true,
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));
