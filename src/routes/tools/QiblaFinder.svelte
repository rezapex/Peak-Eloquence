<script>
	import { onMount } from 'svelte';
	
	export let location;
	export let locationError;
	export let getLocation;
	
	let qiblaDirection = null;
	let compassError = false;
	let compass = null;
	let isCalibrating = false;
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

	$: if (location) {
		qiblaDirection = calculateQibla(location.latitude, location.longitude);
	}

	onMount(() => {
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		if (window.DeviceOrientationEvent) {
			if (typeof DeviceOrientationEvent.requestPermission === 'function') {
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
				window.addEventListener('deviceorientation', handleOrientation);
			}
		} else {
			compassError = true;
		}

		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	});
</script>

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

<style>
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
</style>