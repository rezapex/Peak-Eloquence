<script>
	export let location;
	export let locationError;
	export let getLocation;

	let prayerTimes = null;
	let prayerTimesError = '';

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

	$: if (location) {
		getPrayerTimes(location.latitude, location.longitude);
	}
</script>

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

	.coordinates {
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