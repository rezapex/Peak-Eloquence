<script>
	export let isPlaying = false;
	export let size = 'md';
	export let variant = 'primary';

	const sizeClasses = {
		sm: 'w-8 h-8 text-sm',
		md: 'w-12 h-12 text-base',
		lg: 'w-16 h-16 text-lg'
	};

	const variantClasses = {
		primary: 'bg-[#ff3e00] hover:bg-[#dd3600] text-white',
		secondary: 'bg-white hover:bg-gray-100 text-[#ff3e00] border-2 border-[#ff3e00]',
		minimal: 'bg-transparent hover:bg-gray-100 text-[#ff3e00]'
	};

	$: buttonClasses = `
		${sizeClasses[size]}
		${variantClasses[variant]}
		rounded-full
		flex
		items-center
		justify-center
		transition-all
		duration-200
		focus:outline-none
		focus:ring-2
		focus:ring-[#ff3e00]
		focus:ring-offset-2
	`.trim();
</script>

<button
	class={buttonClasses}
	on:click
	{...$$restProps}
>
	{#if isPlaying}
		<svg 
			class="w-1/2 h-1/2"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<rect x="6" y="4" width="4" height="16" />
			<rect x="14" y="4" width="4" height="16" />
		</svg>
	{:else}
		<svg 
			class="w-1/2 h-1/2 ml-1"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<path d="M8 5v14l11-7z" />
		</svg>
	{/if}
</button>