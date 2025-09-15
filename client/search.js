// Search functionality
// Client-side search integration

class SearchHandler {
    constructor() {
        this.providers = ['trakt', 'tmdb', 'omdb', 'tvdb'];
        this.searchCache = new Map();
        this.init();
    }

    init() {
        console.log('🔍 Stremio Trakt Addon - Search handler initialized');
        this.setupSearchListeners();
    }

    setupSearchListeners() {
        // Listen for search requests from Stremio
        window.addEventListener('message', (event) => {
            if (event.data.type === 'SEARCH_REQUEST') {
                this.handleSearch(event.data);
            }
        });
    }

    async handleSearch(data) {
        const { query, type, limit = 20 } = data;

        console.log(`🔍 Searching for "${query}" in ${type}`, { limit });

        try {
            const results = await this.performSearch(query, type, limit);
            this.sendResponse('SEARCH_RESPONSE', {
                query,
                results: results.slice(0, limit)
            });
        } catch (error) {
            console.error('❌ Search error:', error);
            this.sendResponse('SEARCH_ERROR', { error: error.message });
        }
    }

    async performSearch(query, type, limit) {
        // Check cache first
        const cacheKey = `${query}-${type}`;
        if (this.searchCache.has(cacheKey)) {
            console.log('📋 Using cached search results');
            return this.searchCache.get(cacheKey);
        }

        // Perform multi-provider search
        const searchPromises = this.providers.map(provider =>
            this.searchProvider(provider, query, type)
        );

        const results = await Promise.allSettled(searchPromises);
        const combinedResults = this.combineResults(results);

        // Cache results for 5 minutes
        this.searchCache.set(cacheKey, combinedResults);
        setTimeout(() => {
            this.searchCache.delete(cacheKey);
        }, 5 * 60 * 1000);

        return combinedResults;
    }

    async searchProvider(provider, query, type) {
        const endpoint = `/api/search/${provider}`;
        const params = new URLSearchParams({
            q: query,
            type: type || 'all'
        });

        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();

        return {
            provider,
            results: data.results || [],
            total: data.total || 0
        };
    }

    combineResults(results) {
        const combined = [];
        const seen = new Set();

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                result.value.results.forEach(item => {
                    const key = `${item.type}-${item.id}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        combined.push({
                            ...item,
                            _provider: result.value.provider
                        });
                    }
                });
            }
        });

        // Sort by relevance (could be improved with scoring)
        return combined.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    sendResponse(type, data) {
        window.parent.postMessage({
            type,
            data,
            source: 'stremio-trakt-addon'
        }, '*');
    }
}

// Initialize search handler
document.addEventListener('DOMContentLoaded', () => {
    window.searchHandler = new SearchHandler();
});

console.log('🔍 Search handler script loaded');
