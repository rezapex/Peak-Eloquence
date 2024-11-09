import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    resolve: {
        alias: {
            $lib: "/src/lib"
        }
    },
    build: {
        // Enable minification for production
        minify: true,
        // Generate sourcemaps for better debugging
        sourcemap: true,
        // Optimize dependencies
        commonjsOptions: {
            include: [/node_modules/],
        },
        // Fix the rollup configuration
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Create a chunk for node_modules
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                }
            }
        }
    },
    // Enable server-side rendering
    ssr: {
        noExternal: ['@sveltejs/kit']
    }
} satisfies UserConfig);
