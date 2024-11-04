<script>
	import { onMount } from 'svelte';
	import SearchBar from './SearchBar.svelte';
	import CategoryList from './CategoryList.svelte';
	import ContentItem from './ContentItem.svelte';
	
	export let data;
	
	let selectedCategory = data.categories[0];
	let searchTerm = '';
	let bookmarks = [];
	
	$: filteredItems = selectedCategory.items.filter(item => 
		item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		item.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
		item.content.toLowerCase().includes(searchTerm.toLowerCase())
	);

	onMount(() => {
		const stored = localStorage.getItem('peak-bookmarks');
		if (stored) {
			bookmarks = JSON.parse(stored);
		}
	});

	function toggleBookmark(itemId) {
		const index = bookmarks.indexOf(itemId);
		if (index === -1) {
			bookmarks = [...bookmarks, itemId];
		} else {
			bookmarks = bookmarks.filter(id => id !== itemId);
		}
		localStorage.setItem('peak-bookmarks', JSON.stringify(bookmarks));
	}

	function handleSearch(event) {
		searchTerm = event.detail;
	}
</script>

<svelte:head>
	<title>Peak of Eloquence - Nahj al-Balagha</title>
</svelte:head>

<div class="container">
	<header>
		<a href="/" class="back-link">← Back to Home</a>
		<h1>Peak of Eloquence</h1>
		<p class="subtitle">Nahj al-Balagha - نهج البلاغة</p>
	</header>

	<SearchBar value={searchTerm} on:search={handleSearch} />

	<div class="content">
		<CategoryList 
			categories={data.categories} 
			bind:selectedCategory
		/>

		<main class="items-list">
			<h2>{selectedCategory.name}</h2>
			{#if filteredItems.length === 0}
				<p class="no-results">No items found matching your search.</p>
			{:else}
				{#each filteredItems as item}
					<ContentItem 
						{item}
						bookmarked={bookmarks.includes(item.id)}
						onBookmarkToggle={toggleBookmark}
					/>
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
		text-align: center;
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
	}

	.subtitle {
		color: #666;
		margin: 0.5rem 0;
		font-size: 1.2rem;
	}

	.content {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 2rem;
	}

	.items-list {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.items-list h2 {
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
	}
</style>