import type { PageLoad } from './$types';

interface Surah {
    number: number;
    // Add other surah properties
}

interface AudioData {
    number: number;
    audioUrl: string;
}

export const load: PageLoad = async ({ fetch }) => {
    const [surahsResponse, audioResponse] = await Promise.all([
        fetch('/api/surahs'),
        fetch('/api/audio')
    ]);

    const surahsData = await surahsResponse.json();
    const audioData = await audioResponse.json();

    const surahs = surahsData.data.map((surah: Surah) => ({
        ...surah,
        audioUrl: audioData.data.find((a: AudioData) => a.number === surah.number)?.audioUrl
    }));

    return { surahs };
}; 