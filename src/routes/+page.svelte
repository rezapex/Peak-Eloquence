<script>
	import SearchBar from './SearchBar.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	
	export let data;
	let filteredSurahs = data.surahs;
	let currentAudio = null;
	let playingSurah = null;

	function handleSearch(event) {
		const searchTerm = event.detail.toLowerCase();
		filteredSurahs = data.surahs.filter(surah => 
			surah.englishName.toLowerCase().includes(searchTerm) ||
			surah.englishNameTranslation.toLowerCase().includes(searchTerm) ||
			surah.number.toString().includes(searchTerm)
		);
	}

	function handlePlayStateChange(surah, event) {
		if (event.detail.isPlaying) {
			if (playingSurah && playingSurah !== surah.number) {
				// Stop previous audio if another surah starts playing
				const prevSurah = filteredSurahs.find(s => s.number === playingSurah);
				if (prevSurah) {
					prevSurah.isPlaying = false;
				}
			}
			playingSurah = surah.number;
		} else {
			if (playingSurah === surah.number) {
				playingSurah = null;
			}
		}
		surah.isPlaying = event.detail.isPlaying;
	}
</script>

<svelte:head>
	<title>Quran Reader</title>
	<meta name="description" content="Read and listen to the Holy Quran" />
</svelte:head>

<div class="container">
	<h1>The Holy Quran</h1>
	<div class="content">
		<SearchBar on:search={handleSearch} />
		<div class="surah-grid">
			{#each filteredSurahs as surah}
				<div class="surah-card">
					<a href="/surah/{surah.number}" class="surah-info">
						<div class="number">{surah.number}</div>
						<div class="details">
							<h2>{surah.englishName}</h2>
							<p class="arabic-name">{surah.name}</p>
							<p class="translation">{surah.englishNameTranslation}</p>
							<p class="verses">{surah.numberOfAyahs} verses • {surah.revelationType}</p>
						</div>
					</a>
					{#if surah.audioUrl}
						<div class="audio-section">
							<AudioPlayer
								src={surah.audioUrl}
								title={surah.englishName}
								subtitle={`${surah.numberOfAyahs} verses`}
								size="sm"
								on:playStateChange={(e) => handlePlayStateChange(surah, e)}
							/>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	.content {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		color: var(--color-theme-1);
		margin-bottom: 2rem;
	}

	.surah-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
		margin-top: 2rem;
		width: 100%;
	}

	.surah-card {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.surah-info {
		display: flex;
		align-items: center;
		padding: 1rem;
		text-decoration: none;
		color: inherit;
		transition: background-color 0.2s;
	}

	.surah-info:hover {
		background-color: #f5f5f5;
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
		flex-shrink: 0;
	}

	.details {
		flex: 1;
		min-width: 0;
		overflow: hidden;
	}

	.details h2 {
		margin: 0;
		font-size: 1.1rem;
		color: var(--color-theme-1);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.arabic-name {
		margin: 0.25rem 0;
		font-size: 1.2rem;
		direction: rtl;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.translation {
		color: #666;
		font-style: italic;
		margin: 0.25rem 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.verses {
		margin: 0;
		font-size: 0.9rem;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.audio-section {
		border-top: 1px solid #eee;
		padding: 0.75rem;
	}

	@media (max-width: 640px) {
		.container {
			padding: 0.5rem;
		}

		.surah-card {
			width: 100%;
		}
	}
</style>