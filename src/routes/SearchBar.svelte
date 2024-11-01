<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let searchTerm = '';
	
	function handleInput() {
		dispatch('search', searchTerm);
	}
</script>

<div class="search-container">
	<input
		type="text"
		bind:value={searchTerm}
		on:input={handleInput}
		placeholder="Search surahs by name or number..."
		class="search-input"
	/>
</div>

<style>
	.search-container {
		max-width: 600px;
		margin: 0 auto;
	}

	.search-input {
		width: 100%;
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