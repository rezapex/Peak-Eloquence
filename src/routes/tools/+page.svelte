<script>
	import { onMount } from 'svelte';
	import QuranAIChat from './QuranAIChat.svelte';
	import QiblaFinder from './QiblaFinder.svelte';
	import PrayerTimes from './PrayerTimes.svelte';
	
	let location = null;
	let locationError = '';

	async function getLocation() {
		try {
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});
			
			location = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			};
			
			locationError = '';
		} catch (error) {
			locationError = 'Unable to get your location. Please enable location services.';
		}
	}

	onMount(() => {
		getLocation();
	});
</script>

<svelte:head>
	<title>Tools - Quran Reader</title>
</svelte:head>

<div class="container">
	<header>
		<a href="/" class="back-link">← Back to Home</a>
		<h1>Islamic Tools</h1>
	</header>

	<div class="tools-grid">
		<QiblaFinder {location} {locationError} {getLocation} />
		<PrayerTimes {location} {locationError} {getLocation} />
		<div class="tool-card full-width">
			<h2>Quran AI Assistant</h2>
			<QuranAIChat />
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-block;
		color: var(--color-theme-1);
		text-decoration: none;
		margin-bottom: 1rem;
	}

	h1 {
		color: var(--color-theme-1);
		margin: 0;
		text-align: center;
	}

	.tools-grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.tool-card {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.tool-card.full-width {
		grid-column: 1 / -1;
	}

	h2 {
		color: var(--color-theme-1);
		margin: 0 0 1.5rem;
	}

	@media (max-width: 640px) {
		.container {
			padding: 1rem;
		}

		.tools-grid {
			grid-template-columns: 1fr;
		}
	}
</style>