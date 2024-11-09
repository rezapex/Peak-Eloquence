import type { PageLoad } from './$types';
import type { Surah, AudioData } from '$lib/types/surah';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const [surahsResponse, audioResponse] = await Promise.all([
            fetch('/api/surahs'),
            fetch('/api/audio')
        ]);

        if (!surahsResponse.ok || !audioResponse.ok) {
            return { surahs: [] };
        }

        const surahsData = await surahsResponse.json();
        const audioData = await audioResponse.json();

        const surahs = surahsData.data.map((surah: Surah) => ({
            ...surah,
            audioUrl: audioData.data.find((a: AudioData) => a.number === surah.number)?.audioUrl,
            isPlaying: false
        }));

        return { surahs };
    } catch (error) {
        console.error('Error loading data:', error);
        return { surahs: [] };
    }
}; 