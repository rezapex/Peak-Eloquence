export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    language?: string;
}

export interface SearchFilters {
    type: 'all' | 'verses' | 'translations' | 'tafsir';
    language: string;
}

export type Provider = {
    id: string;
    name: string;
};

export type Language = {
    code: string;
    name: string;
};

