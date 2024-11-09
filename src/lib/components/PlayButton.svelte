<script lang="ts">
	export let isPlaying = false;
	let buttonClasses =
		'play-button flex items-center justify-center rounded-full bg-primary text-white p-2 hover:bg-primary-dark transition-colors';
</script>

<button class={buttonClasses} on:click {...$$restProps}>
	{#if isPlaying}
		<svg class="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<rect x="6" y="4" width="4" height="16" />
			<rect x="14" y="4" width="4" height="16" />
		</svg>
	{:else}
		<svg class="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<polygon points="5 3 19 12 5 21" />
		</svg>
	{/if}
</button>
