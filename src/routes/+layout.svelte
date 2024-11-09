<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import Header from './Header.svelte';
	import '../app.css';
	import { page } from '$app/stores';
	import { inject } from '@vercel/analytics';

	// Initialize Vercel Analytics
	inject();

	$: title = getTitle($page);
	$: description = getDescription($page);

	function getTitle(page: Page): string {
		const baseTitle = 'Quran Reader';
		const path = page.url.pathname;

		if (path === '/') return baseTitle;
		if (path.startsWith('/surah/')) {
			const surahNumber = path.split('/')[2];
			return `Surah ${surahNumber} - ${baseTitle}`;
		}
		if (path === '/duas') return `Duas (Supplications) - ${baseTitle}`;
		if (path === '/tools') return `Islamic Tools - ${baseTitle}`;
		if (path === '/about') return `About - ${baseTitle}`;
		if (path === '/peak') return `Peak of Eloquence - ${baseTitle}`;

		return baseTitle;
	}

	function getDescription(page: Page): string {
		const path = page.url.pathname;
		const baseDesc =
			'Read, listen, and study the Holy Quran with translations and audio recitations.';

		if (path === '/') return baseDesc;
		if (path.startsWith('/surah/'))
			return 'Read and listen to Quranic verses with translations and audio recitations.';
		if (path === '/duas')
			return 'Collection of Islamic supplications (duas) with translations and transliterations.';
		if (path === '/tools')
			return 'Islamic tools including Qibla finder, prayer times, and Quran AI assistant.';
		if (path === '/about') return 'Learn about the Quran Reader application and its features.';
		if (path === '/peak')
			return 'Explore the Peak of Eloquence (Nahj al-Balagha) with translations and commentary.';

		return baseDesc;
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
</svelte:head>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>
			<a href="/">Home</a> •
			<a href="/tools">Tools</a> •
			<a href="/duas">Duas</a> •
			<a href="/about">About</a>
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
		max-width: 100vw;
		overflow-x: hidden;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
		width: 100%;
	}

	footer a {
		font-weight: bold;
		margin: 0 0.5rem;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
