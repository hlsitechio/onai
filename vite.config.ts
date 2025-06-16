
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Conditional import for lovable-tagger to handle version conflicts
let componentTagger: any = null;
try {
  const taggerModule = await import("lovable-tagger");
  componentTagger = taggerModule.componentTagger;
} catch (error) {
  console.warn("lovable-tagger could not be loaded:", error.message);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      // Reduce the number of files being watched
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
      // Use polling for better compatibility but with reasonable interval
      usePolling: false,
    },
  },
  plugins: [
    react(),
    // Only include componentTagger if it was successfully loaded and in development mode
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Advanced bundle optimization
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks to improve caching
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
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/[name]-[hash].js`;
        }
      }
    },
    // Reduce bundle size
    target: 'es2020',
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug']
      }
    } : undefined,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 500
  },
  // Optimize dependency resolution
  optimizeDeps: {
    exclude: ['lovable-tagger'],
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@radix-ui/react-tabs',
      '@radix-ui/react-slot'
    ],
  },
  // Reduce the number of watched files
  define: {
    global: 'globalThis',
  },
}));
