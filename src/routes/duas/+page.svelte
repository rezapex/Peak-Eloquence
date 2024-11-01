<script>
	import DuaCard from './DuaCard.svelte';
	export let data;
	
	let selectedCategory = data.categories[0];
	let searchTerm = '';
	
	$: filteredDuas = selectedCategory.duas.filter(dua => 
		dua.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		dua.translation.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>

<svelte:head>
	<title>Duas (Supplications) - Quran Reader</title>
</svelte:head>

<div class="container">
	<header>
		<a href="/" class="back-link">← Back to Home</a>
		<h1>Duas (Supplications)</h1>
	</header>

	<div class="search-section">
		<input
			type="text"
			bind:value={searchTerm}
			placeholder="Search duas..."
			class="search-input"
		/>
	</div>

	<div class="content">
		<aside class="categories">
			<h2>Categories</h2>
			<ul>
				{#each data.categories as category}
					<li>
						<button
							class:active={selectedCategory.id === category.id}
							on:click={() => selectedCategory = category}
						>
							{category.name}
						</button>
					</li>
				{/each}
			</ul>
		</aside>

		<main class="duas-list">
			<h2>{selectedCategory.name}</h2>
			{#if filteredDuas.length === 0}
				<p class="no-results">No duas found matching your search.</p>
			{:else}
				{#each filteredDuas as dua}
					<DuaCard {dua} />
				{/each}
			{/if}
		</main>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-block;
		color: var(--color-theme-1);
		text-decoration: none;
		margin-bottom: 1rem;
	}

	h1 {
		color: var(--color-theme-1);
		margin: 0;
		text-align: center;
	}

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

	.content {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 2rem;
	}

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

	.duas-list {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.duas-list h2 {
		margin: 0 0 1.5rem;
		color: var(--color-theme-1);
	}

	.no-results {
		text-align: center;
		color: #666;
		padding: 2rem;
	}

	@media (max-width: 768px) {
		.content {
			grid-template-columns: 1fr;
		}

		.categories {
			margin-bottom: 1rem;
		}
	}
</style>