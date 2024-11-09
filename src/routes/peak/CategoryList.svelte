<script lang="ts">
	export let categories: Array<{ id: string; name: string }>;
	export let selectedCategory: { id: string; name: string } | null;
</script>

<aside class="categories">
	<h2>Categories</h2>
	<ul>
		{#each categories as category}
			<li>
				<button
					class:active={selectedCategory?.id === category.id}
					on:click={() => (selectedCategory = category)}
				>
					{category.name}
				</button>
			</li>
		{/each}
	</ul>
</aside>

<style>
	.categories {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.categories h2 {
		margin: 0 0 1rem;
		font-size: 1.2rem;
		color: var(--color-theme-1);
	}

	.categories ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.categories button {
		width: 100%;
		text-align: left;
		padding: 0.8rem 1rem;
		background: none;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.categories button:hover {
		background-color: #f5f5f5;
	}

	.categories button.active {
		background-color: var(--color-theme-1);
		color: white;
	}
</style>
