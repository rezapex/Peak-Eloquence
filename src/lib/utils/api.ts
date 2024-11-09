export async function fetchWithCache(url: string, options: Record<string, any> = {}) {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    // ... rest of the code
} 