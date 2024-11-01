export async function load({ fetch }) {
	const response = await fetch('https://api.alquran.cloud/v1/surah');
	const data = await response.json();
	return {
		surahs: data.data
	};
}