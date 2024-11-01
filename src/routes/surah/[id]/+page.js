export async function load({ params, fetch }) {
	const surahResponse = await fetch(`https://api.alquran.cloud/v1/surah/${params.id}`);
	const surahData = await surahResponse.json();

	const audioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${params.id}/ar.alafasy`);
	const audioData = await audioResponse.json();

	const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${params.id}/en.sahih`);
	const translationData = await translationResponse.json();

	return {
		surah: surahData.data,
		audio: audioData.data,
		translation: translationData.data
	};
}