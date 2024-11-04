<script>
	import { onMount } from 'svelte';
	export let data;
	let audioPlayer;
	let verseAudioPlayer;
	let currentAyah = 0;
	let bookmarks = [];
	let isPlayingComplete = false;

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
		if (verseAudioPlayer) {
			// Stop the complete surah player if it's playing
			if (isPlayingComplete && audioPlayer) {
				audioPlayer.pause();
				isPlayingComplete = false;
			}
			currentAyah = index;
			verseAudioPlayer.src = data.audio.ayahs[index].audio;
			verseAudioPlayer.play();
		}
	}

	function onVerseAudioEnded() {
		if (currentAyah < data.surah.ayahs.length - 1) {
			playAyah(currentAyah + 1);
		}
	}

	function playCompleteSurah() {
		if (audioPlayer) {
			isPlayingComplete = true;
			currentAyah = 0;
			audioPlayer.src = data.audio.ayahs[0].audio;
			audioPlayer.play();
		}
	}

	function onCompleteAudioEnded() {
		if (isPlayingComplete && currentAyah < data.surah.ayahs.length - 1) {
			currentAyah++;
			audioPlayer.src = data.audio.ayahs[currentAyah].audio;
			audioPlayer.play();
		} else {
			isPlayingComplete = false;
			currentAyah = 0;
		}
	}

	function stopAllAudio() {
		if (audioPlayer) {
			audioPlayer.pause();
			audioPlayer.currentTime = 0;
			isPlayingComplete = false;
		}
		if (verseAudioPlayer) {
			verseAudioPlayer.pause();
			verseAudioPlayer.currentTime = 0;
		}
		currentAyah = 0;
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
		<div class="complete-surah-player">
			<h2>Listen to Complete Surah</h2>
			<div class="player-controls">
				<button 
					class="play-btn" 
					on:click={isPlayingComplete ? stopAllAudio : playCompleteSurah}
				>
					{isPlayingComplete ? '◼ Stop' : '▶ Play Complete Surah'}
				</button>
				{#if isPlayingComplete}
					<p class="playing-info">Playing verse {currentAyah + 1} of {data.surah.numberOfAyahs}</p>
				{/if}
			</div>
			<audio
				bind:this={audioPlayer}
				on:ended={onCompleteAudioEnded}
				class="hidden"
			>
				<track kind="captions" />
			</audio>
		</div>
		
		<!-- Hidden audio player for verse-by-verse playback -->
		<audio
			bind:this={verseAudioPlayer}
			on:ended={onVerseAudioEnded}
			class="hidden"
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
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.complete-surah-player {
		text-align: center;
	}

	.complete-surah-player h2 {
		color: var(--color-theme-1);
		font-size: 1.2rem;
		margin: 0 0 1rem;
	}

	.player-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.play-btn {
		background: var(--color-theme-1);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		transition: opacity 0.2s;
	}

	.play-btn:hover {
		opacity: 0.9;
	}

	.playing-info {
		color: #666;
		margin: 0;
	}

	.hidden {
		display: none;
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