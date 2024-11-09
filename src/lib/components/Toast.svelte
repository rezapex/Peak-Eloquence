<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	export let message = '';
	export let type = 'info'; // info, success, error, warning
	export let duration = 3000;

	let visible = true;

	onMount(() => {
		const timer = setTimeout(() => {
			visible = false;
		}, duration);

		return () => clearTimeout(timer);
	});
</script>

{#if visible}
	<div class="toast {type}" role="alert" aria-live="polite" transition:fade>
		<span class="icon">
			{#if type === 'success'}
				✓
			{:else if type === 'error'}
				✕
			{:else if type === 'warning'}
				⚠
			{:else}
				ℹ
			{/if}
		</span>
		<span class="message">{message}</span>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		padding: 1rem;
		border-radius: 4px;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		z-index: 1000;
		max-width: 90vw;
	}

	.success {
		background: #4caf50;
		color: white;
	}

	.error {
		background: #f44336;
		color: white;
	}

	.warning {
		background: #ff9800;
		color: white;
	}

	.info {
		background: #2196f3;
		color: white;
	}

	.icon {
		font-size: 1.2rem;
	}

	.message {
		font-size: 0.9rem;
	}
</style>
