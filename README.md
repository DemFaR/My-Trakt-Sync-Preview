# Stremio Trakt Addon - Preview

This is a **preview repository** showing the client-side code structure of the Stremio Trakt Addon. This preview allows users to:

- Understand the addon architecture
- See client-side implementation examples
- Submit issues and feature requests
- Contribute to documentation

## 🏗️ Architecture Overview

The addon integrates Trakt.tv with Stremio, providing personalized catalogs based on your Trakt watch history.

### Client-Side Components

- **Catalog Browser**: Browse movies/shows from Trakt lists
- **Search Integration**: Search across multiple providers
- **User Authentication**: Trakt OAuth integration
- **Settings Management**: Customize addon behavior

## 📁 Preview Files

```
preview/
├── client/
│   ├── catalog.js          # Catalog browsing logic
│   ├── search.js           # Search functionality
│   ├── auth.js             # Authentication helpers
│   └── settings.js         # Settings management
├── styles/
│   └── main.css           # Basic styling
├── index.html             # Preview page
├── manifest.json          # Addon manifest
└── package.json           # Dependencies
```

## 🔍 What You Can See in Browser Dev Tools

When using the addon, you can inspect these client-side files in your browser's developer tools:

1. **Network Tab**: API calls to Trakt and Stremio
2. **Console Tab**: Debug logs and error messages
3. **Sources Tab**: Client-side JavaScript files
4. **Application Tab**: Local storage and session data

## 🚀 Getting Started

1. Install the addon from https://mytrakt.elfhosted.com
2. Configure your Trakt account
3. Browse personalized catalogs
4. Use the search functionality

## 🐛 Reporting Issues

Found a bug or have a feature request? Please [create an issue](https://github.com/DemFaR/my-trakt-sync-addon-preview/issues) with:

- Browser and OS information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📖 API Documentation

The addon uses these main APIs:
- **Trakt API**: User watch history and lists
- **Stremio SDK**: Addon framework
- **TMDB/OMDB**: Movie/TV metadata
- **TVDB**: Episode information

## 🔒 Privacy & Security

- No user data is stored on external servers
- All authentication uses secure OAuth flows
- API keys are managed securely
- User preferences stored locally

---

*This is a preview repository. The full source code is maintained privately for security and performance reasons.*
