export const CONFIG = {
  AI: {
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro',
  },
  CODEFORCES: {
    BASE_URL: 'https://codeforces.com/api',
    CACHE_MINUTES: 30
  },
  SEARCH: {
    ENGINES: {
      duckduckgo: 'https://duckduckgo.com/?q=',
      google: 'https://www.google.com/search?q=',
      bing: 'https://www.bing.com/search?q=',
      brave: 'https://search.brave.com/search?q='
    },
    DEFAULT: 'duckduckgo'
  },
  UI: {
    PROMPT_PREFIX: {
      USER: 'rayat',
      HOST: 'persephone'
    },
    BACKGROUND: {
      DEFAULT: '/backgrounds/purple-mountains.jpg',  // Updated path
      ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'webp']
    }
  }
};