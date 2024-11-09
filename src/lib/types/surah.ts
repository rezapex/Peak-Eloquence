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
    revelationType: string;
    numberOfAyahs: number;
    ayahs: Ayah[];
}

export interface AudioData {
    ayahs: Array<{
        audio: string;
    }>;
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
