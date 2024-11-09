export interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    audio: string;
}

export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
    audioUrl?: string;
    isPlaying?: boolean;
}

export interface AudioData {
    number: number;
    audioUrl: string;
}

export interface TranslationData {
    ayahs: Array<{
        text: string;
    }>;
}

export interface SurahPageData {
    surah: Surah;
    audio: AudioData;
    translation: TranslationData;
}
