// Settings management
// User preferences and configuration

class SettingsManager {
    constructor() {
        this.settingsKey = 'stremio-trakt-settings';
        this.defaultSettings = {
            // Catalog settings
            defaultSort: 'rank',
            defaultOrder: 'desc',
            itemsPerPage: 50,

            // Search settings
            searchProviders: ['trakt', 'tmdb', 'omdb'],
            searchTimeout: 5000,

            // UI settings
            theme: 'auto',
            language: 'en',
            showAdultContent: false,

            // Performance settings
            enableCaching: true,
            cacheExpiry: 3600000, // 1 hour

            // Privacy settings
            analyticsEnabled: false,
            errorReporting: true
        };

        this.init();
    }

    init() {
        console.log('⚙️ Stremio Trakt Addon - Settings manager initialized');
        this.loadSettings();
        this.setupSettingsListeners();
    }

    setupSettingsListeners() {
        // Listen for settings-related messages
        window.addEventListener('message', (event) => {
            if (event.data.type === 'GET_SETTINGS') {
                this.sendSettings();
            } else if (event.data.type === 'UPDATE_SETTINGS') {
                this.updateSettings(event.data.settings);
            } else if (event.data.type === 'RESET_SETTINGS') {
                this.resetSettings();
            }
        });
    }

    loadSettings() {
        try {
            const stored = localStorage.getItem(this.settingsKey);
            if (stored) {
                this.settings = { ...this.defaultSettings, ...JSON.parse(stored) };
                console.log('📋 Settings loaded from storage');
            } else {
                this.settings = { ...this.defaultSettings };
                console.log('📋 Using default settings');
            }
        } catch (error) {
            console.error('❌ Error loading settings:', error);
            this.settings = { ...this.defaultSettings };
        }
    }

    saveSettings() {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
            console.log('💾 Settings saved to storage');
        } catch (error) {
            console.error('❌ Error saving settings:', error);
        }
    }

    updateSettings(newSettings) {
        // Validate settings before updating
        const validatedSettings = this.validateSettings(newSettings);

        this.settings = { ...this.settings, ...validatedSettings };
        this.saveSettings();

        console.log('🔄 Settings updated:', validatedSettings);
        this.sendSettings();
        this.notifySettingsChanged(validatedSettings);
    }

    validateSettings(settings) {
        const validated = {};

        // Validate sort options
        if (settings.defaultSort) {
            const validSorts = ['rank', 'title', 'year', 'rating', 'added', 'watched', 'released'];
            validated.defaultSort = validSorts.includes(settings.defaultSort) ? settings.defaultSort : this.defaultSettings.defaultSort;
        }

        // Validate order
        if (settings.defaultOrder) {
            validated.defaultOrder = ['asc', 'desc'].includes(settings.defaultOrder) ? settings.defaultOrder : this.defaultSettings.defaultOrder;
        }

        // Validate items per page
        if (settings.itemsPerPage) {
            const perPage = parseInt(settings.itemsPerPage);
            validated.itemsPerPage = (perPage >= 10 && perPage <= 200) ? perPage : this.defaultSettings.itemsPerPage;
        }

        // Validate search providers
        if (settings.searchProviders && Array.isArray(settings.searchProviders)) {
            const validProviders = ['trakt', 'tmdb', 'omdb', 'tvdb'];
            validated.searchProviders = settings.searchProviders.filter(p => validProviders.includes(p));
        }

        // Validate theme
        if (settings.theme) {
            validated.theme = ['light', 'dark', 'auto'].includes(settings.theme) ? settings.theme : this.defaultSettings.theme;
        }

        // Validate boolean settings
        ['showAdultContent', 'enableCaching', 'analyticsEnabled', 'errorReporting'].forEach(key => {
            if (typeof settings[key] === 'boolean') {
                validated[key] = settings[key];
            }
        });

        return validated;
    }

    resetSettings() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        console.log('🔄 Settings reset to defaults');
        this.sendSettings();
        this.notifySettingsChanged(this.settings, true);
    }

    getSetting(key) {
        return this.settings[key];
    }

    setSetting(key, value) {
        this.updateSettings({ [key]: value });
    }

    sendSettings() {
        window.parent.postMessage({
            type: 'SETTINGS_RESPONSE',
            data: { ...this.settings },
            source: 'stremio-trakt-addon'
        }, '*');
    }

    notifySettingsChanged(changedSettings, isReset = false) {
        window.parent.postMessage({
            type: 'SETTINGS_CHANGED',
            data: {
                changed: changedSettings,
                isReset,
                timestamp: Date.now()
            },
            source: 'stremio-trakt-addon'
        }, '*');
    }

    exportSettings() {
        return {
            ...this.settings,
            exported_at: new Date().toISOString(),
            version: '1.0'
        };
    }

    importSettings(settingsData) {
        try {
            if (settingsData.version && settingsData.version === '1.0') {
                const { exported_at, version, ...settings } = settingsData;
                this.updateSettings(settings);
                console.log('📥 Settings imported successfully');
                return true;
            } else {
                throw new Error('Invalid settings format');
            }
        } catch (error) {
            console.error('❌ Error importing settings:', error);
            return false;
        }
    }
}

// Initialize settings manager
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});

console.log('⚙️ Settings manager script loaded');
