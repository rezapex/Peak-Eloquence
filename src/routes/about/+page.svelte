<script>
	const features = [
		{ done: true, text: 'Quran Reading Interface with 3-Column Layout' },
		{ done: true, text: 'Audio Recitation Integration' },
		{ done: true, text: 'Duas Collection' },
		{ done: true, text: 'Qibla Finder (Mobile)' },
		{ done: true, text: 'Prayer Times by Location' },
		{ done: false, text: 'Bookmarking System' },
		{ done: false, text: 'Multiple Translations' },
		{ done: false, text: 'Dark Mode Support' },
		{ done: false, text: 'Offline Support' },
		{ done: false, text: 'Word-by-Word Translation' }
	];

	const socialLinks = [
		{ name: 'GitHub', url: 'https://github.com/rezajafar' },
		{ name: 'LinkedIn', url: 'https://linkedin.com/in/rezajafar' },
		{ name: 'Twitter', url: 'https://twitter.com/rezajafar' }
	];
</script>

<svelte:head>
	<title>About - Quran Reader</title>
	<meta name="description" content="About the Quran Reader application" />
</svelte:head>

<div class="text-column">
	<h1>About</h1>

	<section class="about-section">
		<p>
			Welcome to the Quran Reader application. This project aims to provide a comprehensive and
			user-friendly interface for reading, listening to, and studying the Holy Quran.
		</p>

		<p>
			Created by <a href="https://github.com/rezajafar" target="_blank" rel="noopener noreferrer">Reza Jafar</a>,
			this application combines modern web technologies with traditional Islamic resources to create
			an accessible platform for everyone.
		</p>
	</section>

	<section class="social-section">
		<h2>Connect with Me</h2>
		<div class="social-links">
			{#each socialLinks as link}
				<a
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					class="social-link"
				>
					{link.name}
				</a>
			{/each}
		</div>
	</section>

	<section class="features-section">
		<h2>Features Roadmap</h2>
		<div class="features-list">
			{#each features as feature}
				<div class="feature-item">
					<span class="feature-status">
						{#if feature.done}
							✓
						{:else}
							○
						{/if}
					</span>
					<span class="feature-text">
						{feature.text}
					</span>
				</div>
			{/each}
		</div>
	</section>
</div>

<style>
	.text-column {
		max-width: 48rem;
		margin: 0 auto;
		padding: 1rem;
	}

	h1 {
		color: var(--color-theme-1);
		margin-bottom: 2rem;
	}

	h2 {
		color: var(--color-theme-1);
		font-size: 1.5rem;
		margin: 2rem 0 1rem;
	}

	.about-section {
		margin-bottom: 2rem;
	}

	.about-section p {
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.social-section {
		margin: 2rem 0;
	}

	.social-links {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.social-link {
		display: inline-block;
		padding: 0.5rem 1rem;
		background-color: var(--color-theme-1);
		color: white;
		text-decoration: none;
		border-radius: 4px;
		transition: opacity 0.2s;
	}

	.social-link:hover {
		opacity: 0.9;
		text-decoration: none;
	}

	.features-section {
		margin: 2rem 0;
	}

	.features-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.feature-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.feature-status {
		color: var(--color-theme-1);
		font-weight: bold;
		min-width: 1.5rem;
	}

	.feature-text {
		line-height: 1.4;
	}

	@media (max-width: 640px) {
		.text-column {
			padding: 1rem;
		}
	}
</style>