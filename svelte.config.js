import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib',
			$components: './src/lib/components'
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore missing favicon
				if (path === '/favicon.ico') return;

				// Throw error for other cases
				throw new Error(message);
			}
		}
	},
	preprocess: vitePreprocess(),
};

export default config;
