<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{ search: string }>();

	let searchTerm = '';
	/**
	 * @type {ReturnType<typeof setTimeout>}
	 */
	let timeoutId: ReturnType<typeof setTimeout>;

	function handleInput() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			dispatch('search', searchTerm);
		}, 300); // 300ms debounce
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
		width: 100%;
		margin-bottom: 2rem;
	}

	.search-input {
		width: 100%;
		padding: 0.8rem 1.2rem;
		font-size: 1rem;
		border: 2px solid #ddd;
		border-radius: 8px;
		transition: all 0.2s ease;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		box-sizing: border-box;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-theme-1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transform: translateY(-1px);
	}

	.search-input::placeholder {
		color: #999;
		transition: color 0.2s ease;
	}

	.search-input:focus::placeholder {
		color: #666;
	}
</style>
