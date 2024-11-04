<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let value = '';
	
	function handleInput() {
		dispatch('search', value);
	}
</script>

<div class="search-section">
	<input
		type="text"
		bind:value
		on:input={handleInput}
		placeholder="Search in Peak of Eloquence..."
		class="search-input"
	/>
</div>

<style>
	.search-section {
		margin-bottom: 2rem;
	}

	.search-input {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		display: block;
		padding: 0.8rem 1.2rem;
		font-size: 1rem;
		border: 2px solid #ddd;
		border-radius: 8px;
		transition: border-color 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-theme-1);
	}
</style>