
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Conditional import for lovable-tagger to handle version conflicts
let componentTagger: any = null;
try {
  const taggerModule = await import("lovable-tagger");
  componentTagger = taggerModule.componentTagger;
} catch (error: any) {
  // Only log in development to avoid production noise
  if (process.env.NODE_ENV === 'development') {
    console.warn("lovable-tagger could not be loaded:", error?.message || "Unknown error");
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
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
    // Enhanced deduplication for Plate.js compatibility
    dedupe: [
      'react', 
      'react-dom', 
      '@udecode/slate', 
      '@udecode/slate-react',
      'slate',
      'slate-react'
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
          editor: [
            '@udecode/plate-common',
            '@udecode/plate-basic-elements',
            '@udecode/plate-basic-marks',
            '@udecode/plate-list',
            '@udecode/plate-link',
            '@udecode/plate-media'
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
      'loglevel',
      '@udecode/plate-common',
      '@udecode/slate',
      '@udecode/slate-react'
    ],
    // Force pre-bundling to resolve version conflicts
    force: true,
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));
