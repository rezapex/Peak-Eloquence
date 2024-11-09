<script lang="ts">
	import SearchBar from './SearchBar.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import type { Surah } from '$lib/types/surah';
	import { audioStore } from '$lib/stores/audioStore';

	export let data: { surahs: Surah[] };
	let filteredSurahs = data.surahs;

	function handleSearch(event: CustomEvent<string>) {
		const searchTerm = event.detail.toLowerCase();
		filteredSurahs = data.surahs.filter(
			(surah) =>
				surah.englishName.toLowerCase().includes(searchTerm) ||
				surah.englishNameTranslation.toLowerCase().includes(searchTerm) ||
				surah.number.toString().includes(searchTerm)
		);
	}

	function handlePlayStateChange(surah: Surah, event: CustomEvent<{ isPlaying: boolean }>) {
		surah.isPlaying = event.detail.isPlaying;
		if (event.detail.isPlaying) {
			filteredSurahs = filteredSurahs.map((s) => ({
				...s,
				isPlaying: s.number === surah.number ? true : false
			}));
		}
	}

	$: {
		if ($audioStore.playingId === null) {
			filteredSurahs = filteredSurahs.map((s) => ({
				...s,
				isPlaying: false
			}));
		}
	}

	$: ({ surahs } = data);
</script>

<svelte:head>
	<title>Quran Reader</title>
	<meta name="description" content="Read and listen to the Holy Quran" />
</svelte:head>

<div class="container">
	{#if surahs && surahs.length > 0}
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
								<p class="verses">
									{surah.numberOfAyahs} verses • {surah.revelationType}
								</p>
							</div>
						</a>
						{#if surah.audioUrl}
							<div class="audio-section">
								<AudioPlayer
									src={surah.audioUrl}
									title={surah.englishName}
									subtitle={`${surah.numberOfAyahs} verses`}
									size="sm"
									id={surah.number}
									on:playStateChange={(e) => handlePlayStateChange(surah, e)}
								/>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="message">
			<h2>Welcome to Quran Reader</h2>
			<p>Loading content...</p>
		</div>
	{/if}
</div>

<style>
	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		box-sizing: border-box;
	}

	.content {
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		color: var(--color-theme-1);
		margin-bottom: 2rem;
		font-size: 2.5rem;
	}

	.surah-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 1.25rem;
		margin-top: 2rem;
	}

	.surah-card {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: transform 0.15s ease;
	}

	.surah-card:hover {
		transform: translateY(-2px);
	}

	.surah-info {
		display: flex;
		align-items: flex-start;
		padding: 1.25rem;
		text-decoration: none;
		color: inherit;
		gap: 1rem;
	}

	.number {
		width: 42px;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-theme-1);
		color: white;
		border-radius: 8px;
		font-weight: 500;
		font-size: 1.125rem;
		flex-shrink: 0;
	}

	.details {
		flex: 1;
		min-width: 0;
	}

	.details h2 {
		margin: 0;
		font-size: 1.125rem;
		color: var(--color-theme-1);
		font-weight: 500;
	}

	.arabic-name {
		margin: 0.35rem 0;
		font-size: 1.35rem;
		direction: rtl;
	}

	.translation {
		margin: 0.25rem 0;
		font-style: italic;
		font-size: 0.9rem;
	}

	.verses {
		margin: 0.25rem 0 0;
		font-size: 0.875rem;
		opacity: 0.8;
	}

	.audio-section {
		border-top: 1px solid #eee;
		padding: 0.875rem;
		background: #fafafa;
	}

	@media (max-width: 1024px) {
		.container {
			padding: 1.5rem;
		}

		.surah-grid {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1rem;
		}
	}

	@media (max-width: 768px) {
		.container {
			padding: 1.25rem;
		}

		h1 {
			font-size: 2rem;
			margin-bottom: 1.5rem;
		}

		.surah-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 1rem 0.75rem;
		}

		.surah-info {
			padding: 1rem;
		}

		.number {
			width: 38px;
			height: 38px;
			font-size: 1rem;
		}

		.details h2 {
			font-size: 1.05rem;
		}

		.arabic-name {
			font-size: 1.25rem;
		}

		.audio-section {
			padding: 0.75rem;
		}
	}

	/* Loading message styles */
	.message {
		text-align: center;
		padding: 2rem;
	}

	.message h2 {
		color: var(--color-theme-1);
		margin-bottom: 1rem;
	}
</style>
