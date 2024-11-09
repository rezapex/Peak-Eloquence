/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		[key: string]: any;
	}
}

declare const svelteHTML: {
	[key: string]: any;
};
