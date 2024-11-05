<script>
	import { onMount } from 'svelte';
	export let dua;
	let isPlaying = false;
	let audio;
	let canShare = false;

	onMount(() => {
		// Check if sharing is supported and we have permission
		canShare = Boolean(navigator.share);
	});

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
				isPlaying = false;
			});
			isPlaying = true;
		}
	}

	async function shareDua() {
		const shareText = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\nReference: ${dua.reference}`;
		
		try {
			if (canShare) {
				await navigator.share({
					title: dua.title,
					text: shareText
				});
			} else {
				await navigator.clipboard.writeText(shareText);
				showCopyToast();
			}
		} catch (err) {
			// If share fails, fallback to clipboard
			try {
				await navigator.clipboard.writeText(shareText);
				showCopyToast();
			} catch (clipboardErr) {
				showErrorToast();
			}
		}
	}

	function showCopyToast() {
		const toast = document.createElement('div');
		toast.className = 'toast';
		toast.textContent = 'Dua copied to clipboard!';
		document.body.appendChild(toast);
		
		setTimeout(() => {
			toast.classList.add('fade-out');
			setTimeout(() => document.body.removeChild(toast), 300);
		}, 2000);
	}

	function showErrorToast() {
		const toast = document.createElement('div');
		toast.className = 'toast error';
		toast.textContent = 'Unable to share. Please try again.';
		document.body.appendChild(toast);
		
		setTimeout(() => {
			toast.classList.add('fade-out');
			setTimeout(() => document.body.removeChild(toast), 300);
		}, 2000);
	}
</script>

<div class="dua-card">
	<div class="dua-header">
		<h3>{dua.title}</h3>
		<div class="actions">
			<button class="action-btn" on:click={shareDua} title="Share">
				<svg viewBox="0 0 24 24" width="18" height="18">
					<path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
				</svg>
			</button>
			{#if dua.audio}
				<button class="audio-btn" on:click={toggleAudio}>
					{#if isPlaying}
						◼ Stop
					{:else}
						▶ Play
					{/if}
				</button>
			{/if}
		</div>
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
		transition: box-shadow 0.2s;
	}

	.dua-card:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

	.actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.action-btn {
		background: none;
		border: none;
		color: #666;
		padding: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.action-btn:hover {
		background: #f5f5f5;
		color: var(--color-theme-1);
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

	:global(.toast) {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		background: #333;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		z-index: 1000;
		animation: fade-in 0.3s ease-out;
	}

	:global(.toast.error) {
		background: #e74c3c;
	}

	:global(.toast.fade-out) {
		animation: fade-out 0.3s ease-in forwards;
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translate(-50%, 1rem); }
		to { opacity: 1; transform: translate(-50%, 0); }
	}

	@keyframes fade-out {
		from { opacity: 1; transform: translate(-50%, 0); }
		to { opacity: 0; transform: translate(-50%, 1rem); }
	}
</style>