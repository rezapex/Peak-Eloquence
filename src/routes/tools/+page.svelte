<script>
	import { onMount } from 'svelte';
	let location = null;
	let qiblaDirection = null;
	let compassError = false;
	let locationError = '';
	let compass = null;
	let isCalibrating = false;
	let prayerTimes = null;
	let prayerTimesError = '';
	let isMobile = false;

	function calculateQibla(lat, lng) {
		const kaabaLat = 21.4225;
		const kaabaLng = 39.8262;
		
		const latRad = lat * (Math.PI / 180);
		const lngRad = lng * (Math.PI / 180);
		const kaabaLatRad = kaabaLat * (Math.PI / 180);
		const kaabaLngRad = kaabaLng * (Math.PI / 180);
		
		const y = Math.sin(kaabaLngRad - lngRad);
		const x = Math.cos(latRad) * Math.tan(kaabaLatRad) -
				Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);
		
		let qibla = Math.atan2(y, x) * (180 / Math.PI);
		return (qibla + 360) % 360;
	}

	function handleOrientation(event) {
		if (event.webkitCompassHeading) {
			compass = event.webkitCompassHeading;
		} else if (event.alpha) {
			compass = 360 - event.alpha;
		}
	}

	async function getPrayerTimes(lat, lng) {
		try {
			const date = new Date();
			const timestamp = Math.floor(date.getTime() / 1000);
			const response = await fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=2`);
			const data = await response.json();
			prayerTimes = data.data.timings;
			prayerTimesError = '';
		} catch (error) {
			prayerTimesError = 'Unable to fetch prayer times. Please try again later.';
		}
	}

	async function getLocation() {
		try {
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});
			
			location = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			};
			
			qiblaDirection = calculateQibla(location.latitude, location.longitude);
			await getPrayerTimes(location.latitude, location.longitude);
			locationError = '';
		} catch (error) {
			locationError = 'Unable to get your location. Please enable location services.';
		}
	}

	onMount(() => {
		// Check if device is mobile
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		if (window.DeviceOrientationEvent) {
			if (typeof DeviceOrientationEvent.requestPermission === 'function') {
				// iOS 13+ devices
				isCalibrating = true;
				DeviceOrientationEvent.requestPermission()
					.then(response => {
						if (response === 'granted') {
							window.addEventListener('deviceorientation', handleOrientation);
						} else {
							compassError = true;
						}
						isCalibrating = false;
					})
					.catch(() => {
						compassError = true;
						isCalibrating = false;
					});
			} else {
				// Non iOS 13+ devices
				window.addEventListener('deviceorientation', handleOrientation);
			}
		} else {
			compassError = true;
		}

		getLocation();

		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
		};
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
		<div class="tool-card">
			<h2>Qibla Finder</h2>
			{#if !isMobile}
				<p class="notice">
					⚠️ The Qibla compass requires a mobile device with a compass sensor.
					Please open this page on your smartphone or tablet.
				</p>
			{:else if locationError}
				<p class="error">{locationError}</p>
				<button class="retry-btn" on:click={getLocation}>Retry</button>
			{:else if isCalibrating}
				<p>Calibrating compass...</p>
			{:else if compassError}
				<p class="error">Compass not available on this device.</p>
			{:else if location && qiblaDirection !== null && compass !== null}
				<div 
					class="compass" 
					style="transform: rotate({compass}deg)"
				>
					<div 
						class="qibla-direction"
						style="transform: rotate({qiblaDirection}deg)"
					>
						🕋
					</div>
					<div class="compass-arrow">↑</div>
				</div>
				<p class="coordinates">
					Your Location: {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
				</p>
				<p class="direction">
					Qibla Direction: {qiblaDirection.toFixed(1)}°
				</p>
			{:else}
				<p>Loading...</p>
			{/if}
		</div>

		<div class="tool-card">
			<h2>Prayer Times</h2>
			{#if locationError}
				<p class="error">{locationError}</p>
				<button class="retry-btn" on:click={getLocation}>Retry</button>
			{:else if prayerTimesError}
				<p class="error">{prayerTimesError}</p>
				<button class="retry-btn" on:click={() => getPrayerTimes(location.latitude, location.longitude)}>
					Retry
				</button>
			{:else if prayerTimes}
				<div class="prayer-times">
					<div class="prayer-time">
						<span class="prayer-name">Fajr</span>
						<span class="prayer-hour">{prayerTimes.Fajr}</span>
					</div>
					<div class="prayer-time">
						<span class="prayer-name">Sunrise</span>
						<span class="prayer-hour">{prayerTimes.Sunrise}</span>
					</div>
					<div class="prayer-time">
						<span class="prayer-name">Dhuhr</span>
						<span class="prayer-hour">{prayerTimes.Dhuhr}</span>
					</div>
					<div class="prayer-time">
						<span class="prayer-name">Asr</span>
						<span class="prayer-hour">{prayerTimes.Asr}</span>
					</div>
					<div class="prayer-time">
						<span class="prayer-name">Maghrib</span>
						<span class="prayer-hour">{prayerTimes.Maghrib}</span>
					</div>
					<div class="prayer-time">
						<span class="prayer-name">Isha</span>
						<span class="prayer-hour">{prayerTimes.Isha}</span>
					</div>
				</div>
				<p class="coordinates">
					Based on your location: {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
				</p>
			{:else}
				<p>Loading prayer times...</p>
			{/if}
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
		text-align: center;
	}

	h2 {
		color: var(--color-theme-1);
		margin: 0 0 1.5rem;
	}

	.notice {
		background: #fff3cd;
		color: #856404;
		padding: 1rem;
		border-radius: 4px;
		margin: 1rem 0;
		text-align: left;
	}

	.compass {
		width: 200px;
		height: 200px;
		border: 2px solid var(--color-theme-1);
		border-radius: 50%;
		position: relative;
		margin: 2rem auto;
		transition: transform 0.1s ease-out;
	}

	.compass-arrow {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 2rem;
		color: var(--color-theme-1);
	}

	.qibla-direction {
		position: absolute;
		top: 50%;
		left: 50%;
		transform-origin: center;
		font-size: 2rem;
	}

	.coordinates, .direction {
		margin: 1rem 0;
		color: #666;
		font-size: 0.9rem;
	}

	.error {
		color: #e74c3c;
		margin: 1rem 0;
	}

	.retry-btn {
		background: var(--color-theme-1);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.retry-btn:hover {
		opacity: 0.9;
	}

	.prayer-times {
		display: grid;
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.prayer-time {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: #f8f9fa;
		border-radius: 4px;
	}

	.prayer-name {
		font-weight: 500;
		color: var(--color-theme-1);
	}

	.prayer-hour {
		color: #666;
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