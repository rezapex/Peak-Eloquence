<script lang="ts">
	export let isPlaying = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export const variant: 'primary' | 'secondary' = 'primary';
	export let disabled = false;

	$: buttonClasses = [
		'play-button',
		'flex items-center justify-center',
		'transition-all duration-200',
		size === 'sm' ? 'small' : size === 'md' ? 'medium' : 'large',
		disabled ? 'disabled' : ''
	].join(' ');
</script>

<button
	class={buttonClasses}
	on:click
	{disabled}
	aria-label={isPlaying ? 'Pause' : 'Play'}
	{...$$restProps}
>
	{#if isPlaying}
		<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<rect x="6" y="4" width="4" height="16" rx="1" />
			<rect x="14" y="4" width="4" height="16" rx="1" />
		</svg>
	{:else}
		<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
		</svg>
	{/if}
</button>

<style>
	.play-button {
		border: none;
		cursor: pointer;
		outline: none;
		position: relative;
		background: transparent;
		color: var(--color-theme-1);
		padding: 0;
	}

	.play-button:hover {
		transform: scale(1.1);
	}

	.play-button:active {
		transform: scale(0.95);
	}

	.small {
		width: 24px;
		height: 24px;
	}

	.medium {
		width: 32px;
		height: 32px;
	}

	.large {
		width: 40px;
		height: 40px;
	}

	.icon {
		width: 100%;
		height: 100%;
	}

	.play-button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.play-button.disabled:hover {
		transform: none;
	}

	/* Focus states */
	.play-button:focus-visible {
		outline: 2px solid var(--color-theme-1);
		outline-offset: 2px;
	}

	/* Loading state animation */
	.play-button.disabled::before {
		content: '';
		position: absolute;
		top: -2px;
		left: -2px;
		right: -2px;
		bottom: -2px;
		border: 2px solid var(--color-theme-1);
		border-radius: 50%;
		border-top-color: transparent;
		animation: spin 1s linear infinite;
		opacity: 0.5;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
