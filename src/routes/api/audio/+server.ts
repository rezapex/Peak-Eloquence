import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    // Mock data with actual Quran audio URLs
    const audioData = Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${i + 1}.mp3`
    }));

    return json({
        code: 200,
        status: 'OK',
        data: audioData
    });
}; 