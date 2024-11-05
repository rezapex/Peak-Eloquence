const API_CACHE = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchWithCache(url, options = {}) {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cached = API_CACHE.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        API_CACHE.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}