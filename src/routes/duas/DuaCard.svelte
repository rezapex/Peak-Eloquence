<script>
	export let dua;
	let isPlaying = false;
	let audio;

	function toggleAudio() {
		if (!audio) {
			audio = new Audio(dua.audio);
			audio.addEventListener('ended', () => {
				isPlaying = false;
			});
		}

		if (isPlaying) {
			audio.pause();
			audio.currentTime = 0;
			isPlaying = false;
		} else {
			audio.play().catch(() => {
				// Handle audio playback error
				isPlaying = false;
			});
			isPlaying = true;
		}
	}
</script>

<div class="dua-card">
	<div class="dua-header">
		<h3>{dua.title}</h3>
		<button class="audio-btn" on:click={toggleAudio}>
			{#if isPlaying}
				◼ Stop
			{:else}
				▶ Play
			{/if}
		</button>
	</div>

	<div class="dua-content">
		<p class="arabic">{dua.arabic}</p>
		<p class="transliteration">{dua.transliteration}</p>
		<p class="translation">{dua.translation}</p>
		<p class="reference">{dua.reference}</p>
	</div>
</div>

<style>
	.dua-card {
		background: white;
		border: 1px solid #eee;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.dua-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	h3 {
		margin: 0;
		color: var(--color-theme-1);
		font-size: 1.2rem;
	}

	.audio-btn {
		background: var(--color-theme-1);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.audio-btn:hover {
		opacity: 0.9;
	}

	.dua-content {
		display: grid;
		gap: 1rem;
	}

	.arabic {
		font-size: 1.5rem;
		line-height: 2;
		margin: 0;
		direction: rtl;
		text-align: right;
	}

	.transliteration {
		color: #666;
		font-style: italic;
		margin: 0;
	}

	.translation {
		margin: 0;
		line-height: 1.6;
	}

	.reference {
		color: #666;
		font-size: 0.9rem;
		margin: 0;
		text-align: right;
	}
</style>