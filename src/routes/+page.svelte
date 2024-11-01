<script>
	import SearchBar from './SearchBar.svelte';
	export let data;
	let filteredSurahs = data.surahs;

	function handleSearch(event) {
		const searchTerm = event.detail.toLowerCase();
		filteredSurahs = data.surahs.filter(surah => 
			surah.englishName.toLowerCase().includes(searchTerm) ||
			surah.englishNameTranslation.toLowerCase().includes(searchTerm) ||
			surah.number.toString().includes(searchTerm)
		);
	}
</script>

<svelte:head>
	<title>Quran Reader</title>
	<meta name="description" content="Read and listen to the Holy Quran" />
</svelte:head>

<div class="container">
	<h1>The Holy Quran</h1>
	<SearchBar on:search={handleSearch} />
	<div class="surah-grid">
		{#each filteredSurahs as surah}
			<a href="/surah/{surah.number}" class="surah-card">
				<div class="number">{surah.number}</div>
				<div class="details">
					<h2>{surah.englishName}</h2>
					<p class="arabic-name">{surah.name}</p>
					<p class="translation">{surah.englishNameTranslation}</p>
					<p class="verses">{surah.numberOfAyahs} verses • {surah.revelationType}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		text-align: center;
		color: var(--color-theme-1);
		margin-bottom: 2rem;
	}

	.surah-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-top: 2rem;
	}

	@media (max-width: 1024px) {
		.surah-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.surah-grid {
			grid-template-columns: 1fr;
		}
	}

	.surah-card {
		display: flex;
		align-items: center;
		padding: 1rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s;
	}

	.surah-card:hover {
		transform: translateY(-2px);
	}

	.number {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-theme-1);
		color: white;
		border-radius: 50%;
		margin-right: 1rem;
		font-weight: bold;
	}

	.details {
		flex: 1;
	}

	.details h2 {
		margin: 0;
		font-size: 1.1rem;
		color: var(--color-theme-1);
	}

	.arabic-name {
		margin: 0.25rem 0;
		font-size: 1.2rem;
		direction: rtl;
	}

	.translation {
		color: #666;
		font-style: italic;
		margin: 0.25rem 0;
	}

	.verses {
		margin: 0;
		font-size: 0.9rem;
		color: #666;
	}
</style>