// Catalog browsing functionality
// This code runs client-side in the browser

class CatalogBrowser {
    constructor() {
        this.baseUrl = '/addon';
        this.userId = null;
        this.init();
    }

    init() {
        console.log('🎬 Stremio Trakt Addon - Catalog Browser initialized');
        this.setupEventListeners();
        this.loadUserSettings();
    }

    setupEventListeners() {
        // Listen for catalog requests
        window.addEventListener('message', (event) => {
            if (event.data.type === 'CATALOG_REQUEST') {
                this.handleCatalogRequest(event.data);
            }
        });
    }

    async handleCatalogRequest(data) {
        const { type, id, extra } = data;

        console.log(`📋 Loading catalog: ${type}/${id}`, extra);

        try {
            const response = await this.fetchCatalog(type, id, extra);
            this.sendResponse('CATALOG_RESPONSE', response);
        } catch (error) {
            console.error('❌ Catalog load error:', error);
            this.sendResponse('CATALOG_ERROR', { error: error.message });
        }
    }

    async fetchCatalog(type, id, extra = {}) {
        const params = new URLSearchParams({
            type,
            id,
            ...extra
        });

        const response = await fetch(`${this.baseUrl}/catalog/${type}/${id}?${params}`);
        return await response.json();
    }

    sendResponse(type, data) {
        window.parent.postMessage({
            type,
            data,
            source: 'stremio-trakt-addon'
        }, '*');
    }

    loadUserSettings() {
        // Load user preferences from localStorage
        const settings = localStorage.getItem('stremio-trakt-settings');
        if (settings) {
            this.userSettings = JSON.parse(settings);
            console.log('⚙️ User settings loaded:', this.userSettings);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.catalogBrowser = new CatalogBrowser();
});

console.log('🎬 Catalog browser script loaded');
