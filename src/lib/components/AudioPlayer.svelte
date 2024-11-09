<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import PlayButton from './PlayButton.svelte';
	import { audioStore, audioActions } from '$lib/stores/audioStore';

	export let src: string;
	export let title: string;
	export let subtitle: string = '';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let id: string | number;

	let audio: HTMLAudioElement | null = null;
	let progress = 0;
	let duration = 0;
	let currentTime = 0;
	let isPlaying = false;
	let isLoading = true;

	const dispatch = createEventDispatcher();

	// Subscribe to the global audio store
	$: {
		if ($audioStore.playingId !== id && isPlaying && audio) {
			audio.pause();
			isPlaying = false;
			dispatch('playStateChange', { isPlaying });
		}
	}

	onMount(() => {
		audio = new Audio(src);

		const handleTimeUpdate = () => {
			if (!audio?.duration) return;
			currentTime = audio.currentTime;
			progress = (audio.currentTime / audio.duration) * 100;
		};

		const handleLoadedMetadata = () => {
			if (!audio) return;
			duration = audio.duration;
			isLoading = false;
		};

		const handleEnded = () => {
			isPlaying = false;
			audioActions.stopAll();
			dispatch('playStateChange', { isPlaying });
		};

		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('loadedmetadata', handleLoadedMetadata);
		audio.addEventListener('ended', handleEnded);
		audio.addEventListener('playing', () => {
			isLoading = false;
		});
		audio.addEventListener('waiting', () => {
			isLoading = true;
		});
		audio.addEventListener('error', handleError);

		// Preload audio metadata
		audio.preload = 'metadata';

		return () => {
			if (!audio) return;
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
			audio.removeEventListener('ended', handleEnded);
			audio.removeEventListener('playing', () => {});
			audio.removeEventListener('waiting', () => {});
			audio.removeEventListener('error', handleError);
			audio.pause();
		};
	});

	function handleError(e: ErrorEvent) {
		console.error('Audio error:', e);
		isPlaying = false;
		isLoading = false;
		dispatch('playStateChange', { isPlaying, error: true });
	}

	async function togglePlay() {
		if (!audio) return;

		try {
			if (isPlaying) {
				audio.pause();
				audioActions.stopAll();
			} else {
				audioActions.setPlaying(id);
				await audio.play();
			}
			isPlaying = !isPlaying;
			dispatch('playStateChange', { isPlaying });
		} catch (error) {
			console.error('Playback error:', error);
			isPlaying = false;
			dispatch('playStateChange', { isPlaying, error: true });
		}
	}

	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	onDestroy(() => {
		if (audio) {
			audio.pause();
			if (isPlaying) {
				audioActions.stopAll();
			}
		}
	});
</script>

<div class="audio-player {size}">
	<div class="player-content">
		<PlayButton {isPlaying} {size} disabled={isLoading} on:click={togglePlay} />
		<div class="track-info">
			<div class="title">{title}</div>
			{#if subtitle}
				<div class="subtitle">{subtitle}</div>
			{/if}
		</div>
	</div>
	<div class="progress-container">
		<div class="time">{formatTime(currentTime)}</div>
		<div class="progress-bar" class:loading={isLoading}>
			<div class="progress" style="width: {progress}%" />
		</div>
		<div class="time">{formatTime(duration || 0)}</div>
	</div>
</div>

<style>
	.audio-player {
		background: white;
		border-radius: 8px;
		padding: 0.5rem;
	}

	.player-content {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.track-info {
		flex: 1;
		min-width: 0;
	}

	.title {
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.subtitle {
		font-size: 0.875rem;
		color: #666;
	}

	.progress-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.progress-bar {
		flex: 1;
		height: 4px;
		background: #eee;
		border-radius: 2px;
		overflow: hidden;
	}

	.progress {
		height: 100%;
		background: var(--color-theme-1);
		transition: width 0.1s linear;
	}

	.time {
		font-size: 0.75rem;
		color: #666;
		min-width: 3rem;
	}

	.sm {
		font-size: 0.875rem;
	}

	.md {
		font-size: 1rem;
	}

	.lg {
		font-size: 1.125rem;
	}

	.progress-bar.loading {
		opacity: 0.5;
		position: relative;
	}

	.progress-bar.loading::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.5) 50%,
			transparent 100%
		);
		animation: loading 1.5s infinite;
	}

	@keyframes loading {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(100%);
		}
	}
</style>
