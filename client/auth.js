// Authentication helpers
// Trakt OAuth integration

class AuthManager {
    constructor() {
        this.traktConfig = {
            clientId: 'your-trakt-client-id', // Would be set server-side
            redirectUri: window.location.origin + '/auth/callback'
        };
        this.tokenStorage = 'trakt_auth_token';
        this.init();
    }

    init() {
        console.log('🔐 Stremio Trakt Addon - Auth manager initialized');
        this.checkExistingAuth();
        this.setupAuthListeners();
    }

    setupAuthListeners() {
        // Listen for auth-related messages
        window.addEventListener('message', (event) => {
            if (event.data.type === 'AUTH_REQUEST') {
                this.startAuthFlow();
            } else if (event.data.type === 'AUTH_LOGOUT') {
                this.logout();
            }
        });
    }

    checkExistingAuth() {
        const token = this.getStoredToken();
        if (token && this.isTokenValid(token)) {
            console.log('✅ Valid auth token found');
            this.sendAuthStatus(true);
        } else {
            console.log('❌ No valid auth token');
            this.sendAuthStatus(false);
        }
    }

    startAuthFlow() {
        console.log('🚀 Starting Trakt OAuth flow');

        const authUrl = 'https://trakt.tv/oauth/authorize?' + new URLSearchParams({
            response_type: 'code',
            client_id: this.traktConfig.clientId,
            redirect_uri: this.traktConfig.redirectUri,
            state: this.generateState()
        });

        // Open auth popup
        const popup = window.open(
            authUrl,
            'trakt-auth',
            'width=600,height=700,scrollbars=yes'
        );

        // Listen for auth completion
        this.listenForAuthCallback(popup);
    }

    listenForAuthCallback(popup) {
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed);
                // Check if auth was successful
                this.checkExistingAuth();
            }
        }, 1000);

        // Listen for postMessage from auth callback
        window.addEventListener('message', (event) => {
            if (event.data.type === 'AUTH_CALLBACK') {
                clearInterval(checkClosed);
                popup.close();
                this.handleAuthCallback(event.data);
            }
        });
    }

    async handleAuthCallback(data) {
        const { code, state } = data;

        if (!this.verifyState(state)) {
            console.error('❌ Invalid auth state');
            return;
        }

        try {
            const token = await this.exchangeCodeForToken(code);
            this.storeToken(token);
            this.sendAuthStatus(true);
            console.log('✅ Authentication successful');
        } catch (error) {
            console.error('❌ Authentication failed:', error);
            this.sendAuthStatus(false, error.message);
        }
    }

    async exchangeCodeForToken(code) {
        const response = await fetch('/api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code,
                client_id: this.traktConfig.clientId,
                redirect_uri: this.traktConfig.redirectUri
            })
        });

        return await response.json();
    }

    logout() {
        localStorage.removeItem(this.tokenStorage);
        this.sendAuthStatus(false);
        console.log('👋 User logged out');
    }

    getStoredToken() {
        const data = localStorage.getItem(this.tokenStorage);
        return data ? JSON.parse(data) : null;
    }

    storeToken(token) {
        localStorage.setItem(this.tokenStorage, JSON.stringify({
            ...token,
            stored_at: Date.now()
        }));
    }

    isTokenValid(token) {
        if (!token || !token.access_token) return false;

        // Check if token is expired (Trakt tokens last 3 months)
        const expiresAt = token.created_at + (token.expires_in || 7776000);
        return Date.now() < expiresAt * 1000;
    }

    generateState() {
        const state = Math.random().toString(36).substring(2);
        sessionStorage.setItem('auth_state', state);
        return state;
    }

    verifyState(state) {
        const stored = sessionStorage.getItem('auth_state');
        sessionStorage.removeItem('auth_state');
        return state === stored;
    }

    sendAuthStatus(authenticated, error = null) {
        window.parent.postMessage({
            type: 'AUTH_STATUS',
            data: {
                authenticated,
                error,
                user: authenticated ? this.getUserInfo() : null
            },
            source: 'stremio-trakt-addon'
        }, '*');
    }

    getUserInfo() {
        const token = this.getStoredToken();
        return token ? {
            username: token.username,
            name: token.name
        } : null;
    }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

console.log('🔐 Auth manager script loaded');
