const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENROUTER_API_KEY && !OPENAI_API_KEY) {
    console.error('No API keys found. Please set either VITE_OPENROUTER_API_KEY or VITE_OPENAI_API_KEY in your .env file');
}

export const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export const config = {
    openrouter: {
        apiKey: OPENROUTER_API_KEY,
        url: 'https://openrouter.ai/api/v1/chat/completions'
    },
    openai: {
        apiKey: OPENAI_API_KEY,
        url: 'https://api.openai.com/v1/chat/completions'
    },
    defaultProvider: OPENAI_API_KEY ? 'openai' : 'openrouter',
    OPENAI_URL: 'https://api.openai.com/v1/chat/completions'
} as const; 