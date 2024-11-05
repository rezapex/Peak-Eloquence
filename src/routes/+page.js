export async function load({ fetch }) {
	const [surahsResponse, audioResponse] = await Promise.all([
		fetch('https://api.alquran.cloud/v1/surah'),
		fetch('https://api.alquran.cloud/v1/surah?audio=1')
	]);

	const surahsData = await surahsResponse.json();
	const audioData = await audioResponse.json();

	// Merge audio data with surah data
	const surahs = surahsData.data.map(surah => ({
		...surah,
		audioUrl: audioData.data.find(a => a.number === surah.number)?.audioUrl
	}));

	return { surahs };
}