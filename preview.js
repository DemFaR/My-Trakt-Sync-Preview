// Preview page interactivity
// This shows how the client-side code works together

class PreviewApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 My Trakt Sync Addon Preview initialized');
        this.setupEventListeners();
        this.showPreviewData();
    }

    setupEventListeners() {
        // Authentication button
        document.getElementById('auth-btn').addEventListener('click', () => {
            this.simulateAuth();
        });

        // Catalog button
        document.getElementById('catalog-btn').addEventListener('click', () => {
            this.showSampleCatalog();
        });

        // Search functionality
        document.getElementById('search-btn').addEventListener('click', () => {
            this.performDemoSearch();
        });

        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performDemoSearch();
            }
        });

        // Settings toggles
        document.getElementById('cache-toggle').addEventListener('click', () => {
            this.toggleSetting('cache-toggle', 'enableCaching');
        });

        document.getElementById('adult-toggle').addEventListener('click', () => {
            this.toggleSetting('adult-toggle', 'showAdultContent');
        });

        document.getElementById('analytics-toggle').addEventListener('click', () => {
            this.toggleSetting('analytics-toggle', 'analyticsEnabled');
        });

        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showAllSettings();
        });
    }

    simulateAuth() {
        const btn = document.getElementById('auth-btn');
        const status = document.getElementById('auth-status');

        btn.textContent = 'Connecting...';
        btn.disabled = true;

        setTimeout(() => {
            // Simulate successful auth
            status.innerHTML = '<span class="status-indicator online"></span>Authenticated as preview-user';
            btn.textContent = 'Connected ✓';
            btn.style.background = '#10b981';

            console.log('✅ Preview authentication successful');
        }, 2000);
    }

    showSampleCatalog() {
        const sampleData = {
            metas: [
                {
                    id: 'tt0111161',
                    type: 'movie',
                    name: 'The Shawshank Redemption',
                    year: 1994,
                    poster: 'https://image.tmdb.org/t/p/w300/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
                    background: 'https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
                    logo: 'https://image.tmdb.org/t/p/w300/9cqNxx0GxF0bflZmeSMuL5tnGzr.png',
                    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
                    runtime: '142 min',
                    genres: ['Drama', 'Crime'],
                    rating: 9.3,
                    votes: '2.8M'
                },
                {
                    id: 'tt0068646',
                    type: 'movie',
                    name: 'The Godfather',
                    year: 1972,
                    poster: 'https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
                    background: 'https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
                    logo: 'https://image.tmdb.org/t/p/w300/3LzN6QG2jcQ0iR8f9jN5wYQ.png',
                    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
                    runtime: '175 min',
                    genres: ['Crime', 'Drama'],
                    rating: 9.2,
                    votes: '2.1M'
                }
            ]
        };

        console.log('📋 Sample catalog data:', sampleData);
        alert('Check the browser console to see the sample catalog data structure!');
    }

    performDemoSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (!query) return;

        const resultsDiv = document.getElementById('search-results');
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<p>Searching...</p>';

        setTimeout(() => {
            const mockResults = this.generateMockResults(query);
            this.displaySearchResults(mockResults);
            console.log('🔍 Preview search results:', mockResults);
        }, 1000);
    }

    generateMockResults(query) {
        const mockMovies = [
            { id: 'tt0111161', name: 'The Shawshank Redemption', year: 1994, type: 'movie' },
            { id: 'tt0068646', name: 'The Godfather', year: 1972, type: 'movie' },
            { id: 'tt0071562', name: 'The Godfather: Part II', year: 1974, type: 'movie' },
            { id: 'tt0468569', name: 'The Dark Knight', year: 2008, type: 'movie' },
            { id: 'tt0050083', name: '12 Angry Men', year: 1957, type: 'movie' }
        ];

        return mockMovies
            .filter(movie => movie.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
    }

    displaySearchResults(results) {
        const resultsDiv = document.getElementById('search-results');

        if (results.length === 0) {
            resultsDiv.innerHTML = '<p>No results found</p>';
            return;
        }

        const html = results.map(result => `
            <div class="result-item">
                <img src="https://via.placeholder.com/50x75/374151/60a5fa?text=${result.name.charAt(0)}" alt="${result.name}">
                <div class="result-info">
                    <h4>${result.name}</h4>
                    <p>${result.year} • ${result.type}</p>
                </div>
            </div>
        `).join('');

        resultsDiv.innerHTML = html;
    }

    toggleSetting(toggleId, settingKey) {
        const toggle = document.getElementById(toggleId);
        toggle.classList.toggle('active');

        const isActive = toggle.classList.contains('active');
        console.log(`⚙️ Setting ${settingKey}: ${isActive}`);

        // In real addon, this would update settings manager
        if (window.settingsManager) {
            window.settingsManager.setSetting(settingKey, isActive);
        }
    }

    showAllSettings() {
        if (window.settingsManager) {
            const settings = window.settingsManager.exportSettings();
            console.log('⚙️ All settings:', settings);
            alert('Check the browser console to see all current settings!');
        } else {
            console.log('⚙️ Preview settings:', {
                defaultSort: 'rank',
                defaultOrder: 'desc',
                itemsPerPage: 50,
                enableCaching: true,
                showAdultContent: false,
                analyticsEnabled: false
            });
            alert('Check the browser console to see preview settings!');
        }
    }

    showPreviewData() {
        // Show some preview data in console
        console.log('🎬 My Trakt Sync Addon Preview Data:');
        console.log('├── Version: 1.0.0-preview');
        console.log('├── User: preview-user');
        console.log('├── Catalogs: watchlist, favorites, recommendations');
        console.log('├── Search providers: trakt, tmdb, omdb, tvdb');
        console.log('└── Settings: loaded from preview defaults');

        // Set window properties that users can inspect
        window.addonVersion = '1.0.0-preview';
        window.previewMode = true;
        window.availableCatalogs = [
            'watchlist/movies',
            'watchlist/shows',
            'favorites/movies',
            'favorites/shows',
            'recommendations/movies',
            'recommendations/shows'
        ];
    }
}

// Initialize preview when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.previewApp = new PreviewApp();
});

console.log('🎭 Preview app script loaded');
