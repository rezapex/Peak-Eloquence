<script lang="ts">
	import { onMount } from 'svelte';
	import SearchBar from './SearchBar.svelte';
	import CategoryList from './CategoryList.svelte';
	import ContentItem from './ContentItem.svelte';

	export let data;

	let selectedCategory = data.categories[0];
	let searchTerm = '';
	let bookmarks: string[] = [];

	interface PeakItem {
		id: number;
		title: string;
		translation: string;
		content: string;
		arabic: string;
		reference: string;
	}

	$: filteredItems = selectedCategory.items.filter(
		(item: PeakItem) =>
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

	function toggleBookmark(itemId: number) {
		const index = bookmarks.indexOf(itemId.toString());
		if (index === -1) {
			bookmarks = [...bookmarks, itemId.toString()];
		} else {
			bookmarks = bookmarks.filter((id) => id !== itemId.toString());
		}
		localStorage.setItem('peak-bookmarks', JSON.stringify(bookmarks));
	}

	function handleSearch(event: CustomEvent<string>) {
		searchTerm = event.detail;
	}
</script>

<svelte:head>
	<title>Peak of Eloquence - Nahj al-Balagha</title>
</svelte:head>

<div class="container">
	<div class="content-wrapper">
		<header>
			<a href="/" class="back-link">← Back to Home</a>
			<h1>Peak of Eloquence</h1>
			<p class="subtitle">Nahj al-Balagha - نهج البلاغة</p>
		</header>

		<SearchBar value={searchTerm} on:search={handleSearch} />

		<div class="content">
			<CategoryList categories={data.categories} bind:selectedCategory />

			<main class="items-list">
				<h2>{selectedCategory.name}</h2>
				{#if filteredItems.length === 0}
					<p class="no-results">No items found matching your search.</p>
				{:else}
					{#each filteredItems as item}
						<ContentItem
							{item}
							bookmarked={bookmarks.includes(item.id.toString())}
							onBookmarkToggle={toggleBookmark}
						/>
					{/each}
				{/if}
			</main>
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.content-wrapper {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
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
		width: 100%;
		margin-top: 2rem;
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
