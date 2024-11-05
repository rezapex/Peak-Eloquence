<script>
	import { createEventDispatcher } from 'svelte';
	import PlayButton from './PlayButton.svelte';

	export let src = '';
	export let title = '';
	export let subtitle = '';
	export let size = 'md';

	let audio;
	let isPlaying = false;
	let progress = 0;
	let duration = 0;
	let currentTime = 0;

	const dispatch = createEventDispatcher();

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function togglePlay() {
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		
		dispatch('playStateChange', { isPlaying: !isPlaying });
	}

	function updateProgress() {
		if (!audio) return;
		progress = (audio.currentTime / audio.duration) * 100;
		currentTime = audio.currentTime;
	}

	function seek(event) {
		if (!audio) return;
		const bounds = event.currentTarget.getBoundingClientRect();
		const percent = (event.clientX - bounds.left) / bounds.width;
		audio.currentTime = audio.duration * percent;
	}

	$: if (audio) {
		audio.addEventListener('play', () => isPlaying = true);
		audio.addEventListener('pause', () => isPlaying = false);
		audio.addEventListener('ended', () => {
			isPlaying = false;
			dispatch('ended');
		});
		audio.addEventListener('timeupdate', updateProgress);
		audio.addEventListener('loadedmetadata', () => {
			duration = audio.duration;
		});
	}
</script>

<div class="audio-player {size}">
	<audio bind:this={audio} {src}>
		<track kind="captions">
	</audio>

	<div class="player-content">
		<div class="player-info">
			{#if title}
				<div class="title">{title}</div>
			{/if}
			{#if subtitle}
				<div class="subtitle">{subtitle}</div>
			{/if}
		</div>

		<div class="player-controls">
			<PlayButton 
				{isPlaying}
				on:click={togglePlay}
				{size}
				variant="minimal"
			/>
			
			<div class="progress-container">
				<div 
					class="progress-bar"
					on:click={seek}
				>
					<div 
						class="progress-fill"
						style="width: {progress}%"
					></div>
				</div>
				<div class="time">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.audio-player {
		background: white;
		border-radius: 8px;
		padding: 0.75rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.audio-player.sm {
		padding: 0.5rem;
	}

	.audio-player.lg {
		padding: 1rem;
	}

	.player-content {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.player-info {
		min-width: 0;
		flex: 1;
	}

	.title {
		font-weight: 500;
		color: var(--color-theme-1);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.subtitle {
		font-size: 0.875rem;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.player-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 2;
	}

	.progress-container {
		flex: 1;
		min-width: 0;
	}

	.progress-bar {
		height: 4px;
		background: #eee;
		border-radius: 2px;
		cursor: pointer;
		position: relative;
		margin-bottom: 0.25rem;
	}

	.progress-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--color-theme-1);
		border-radius: 2px;
		transition: width 0.1s linear;
	}

	.time {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #666;
	}

	@media (max-width: 640px) {
		.player-content {
			flex-direction: column;
			gap: 0.5rem;
		}

		.player-info {
			text-align: center;
		}

		.player-controls {
			width: 100%;
		}
	}
</style>