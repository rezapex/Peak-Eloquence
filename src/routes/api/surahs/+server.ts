import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    // Mock data for development
    const surahs = Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        name: `Surah ${i + 1}`,
        englishName: `Surah ${i + 1}`,
        englishNameTranslation: `The ${i + 1}th Chapter`,
        numberOfAyahs: 7,
        revelationType: 'Meccan'
    }));

    return json({
        code: 200,
        status: 'OK',
        data: surahs
    });
}; 