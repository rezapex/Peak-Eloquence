<script>
	import { onMount } from 'svelte';
	export let data;
	let audioPlayer;
	let currentAyah = 0;
	let bookmarks = [];

	onMount(() => {
		const stored = localStorage.getItem(`bookmarks-${data.surah.number}`);
		if (stored) {
			bookmarks = JSON.parse(stored);
		}
	});

	function toggleBookmark(ayahNumber) {
		const index = bookmarks.indexOf(ayahNumber);
		if (index === -1) {
			bookmarks = [...bookmarks, ayahNumber];
		} else {
			bookmarks = bookmarks.filter(n => n !== ayahNumber);
		}
		localStorage.setItem(`bookmarks-${data.surah.number}`, JSON.stringify(bookmarks));
	}

	function playAyah(index) {
		if (audioPlayer) {
			currentAyah = index;
			audioPlayer.src = data.audio.ayahs[index].audio;
			audioPlayer.play();
		}
	}

	function onAudioEnded() {
		if (currentAyah < data.surah.ayahs.length - 1) {
			playAyah(currentAyah + 1);
		}
	}
</script>

<svelte:head>
	<title>{data.surah.englishName} - Quran Reader</title>
</svelte:head>

<div class="container">
	<a href="/" class="back-link">← Back to Surahs</a>
	
	<header>
		<h1>{data.surah.englishName}</h1>
		<p class="arabic-name">{data.surah.name}</p>
		<p class="info">
			{data.surah.revelationType} • {data.surah.numberOfAyahs} verses
		</p>
	</header>

	<div class="audio-controls">
		<audio
			bind:this={audioPlayer}
			on:ended={onAudioEnded}
			controls
			controlsList="nodownload"
		>
			<track kind="captions" />
		</audio>
	</div>

	<div class="verses">
		{#each data.surah.ayahs as ayah, index}
			<div class="verse" on:click={() => playAyah(index)}>
				<div class="verse-header">
					<div class="verse-number">{ayah.numberInSurah}</div>
					<button 
						class="bookmark-btn" 
						on:click|stopPropagation={() => toggleBookmark(ayah.numberInSurah)}
						class:active={bookmarks.includes(ayah.numberInSurah)}
					>
						★
					</button>
				</div>
				<div class="verse-text">
					<p class="arabic">{ayah.text}</p>
					<p class="translation">{data.translation.ayahs[index].text}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 2rem;
		color: var(--color-theme-1);
		text-decoration: none;
	}

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	h1 {
		color: var(--color-theme-1);
		margin: 0;
	}

	.arabic-name {
		font-size: 2rem;
		margin: 0.5rem 0;
		direction: rtl;
	}

	.info {
		color: #666;
	}

	.audio-controls {
		margin: 2rem 0;
		display: flex;
		justify-content: center;
	}

	audio {
		width: 100%;
		max-width: 500px;
	}

	.verses {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 1rem;
	}

	.verse {
		padding: 1rem;
		border-bottom: 1px solid #eee;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.verse:last-child {
		border-bottom: none;
	}

	.verse:hover {
		background-color: #f5f5f5;
	}

	.verse-header {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}

	.verse-number {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-theme-1);
		color: white;
		border-radius: 50%;
		margin-right: 1rem;
		flex-shrink: 0;
	}

	.bookmark-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #ddd;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
	}

	.bookmark-btn.active {
		color: gold;
	}

	.verse-text {
		flex: 1;
	}

	.arabic {
		font-size: 1.5rem;
		line-height: 2.5;
		margin: 0;
		direction: rtl;
		text-align: right;
	}

	.translation {
		margin: 1rem 0 0;
		color: #666;
		line-height: 1.6;
	}
</style>