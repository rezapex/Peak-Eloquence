export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    language?: string;
}

export interface SearchFilters {
    type: 'all' | 'verses' | 'translations' | 'tafsir';
    language: string;
}

export interface Provider {
    id: string;
    name: string;
}

export interface Language {
    code: string;
    name: string;
}
