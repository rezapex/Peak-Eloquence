<script lang="ts">
	import { onMount } from 'svelte';
	import QuranAIChat from './QuranAIChat.svelte';
	import QiblaFinder from './QiblaFinder.svelte';
	import PrayerTimes from './PrayerTimes.svelte';

	let location: { latitude: number; longitude: number } | null = null;
	let locationError: string = '';

	interface GeolocationPosition {
		coords: {
			latitude: number;
			longitude: number;
			accuracy: number;
		};
	}

	function handlePosition(position: GeolocationPosition) {
		location = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		};
	}

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(handlePosition, (error) => {
				locationError = error.message;
				console.error(locationError);
			});
		} else {
			locationError = 'Geolocation is not supported by your browser';
			console.error(locationError);
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
	<div class="content-wrapper">
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
</div>

<style>
	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow-x: hidden; /* Prevent horizontal scrolling */
	}

	.content-wrapper {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
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
		width: 100%;
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		margin-top: 2rem;
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
			padding: 1rem; /* Reduce padding on mobile */
		}

		.tools-grid {
			grid-template-columns: 1fr;
			gap: 1rem; /* Reduce gap on mobile */
		}

		.tool-card {
			padding: 1rem; /* Reduce padding on mobile */
		}
	}
</style>
