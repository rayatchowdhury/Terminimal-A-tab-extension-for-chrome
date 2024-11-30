
import { render } from '../helpers.js';

export default {
  description: 'Searches DuckDuckGo for the given query',
  execute: (args) => {
    const query = args.join(' ');
    if (query) {
      window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    } else {
      render('No query provided, redirecting to DuckDuckGo.');
      window.location.href = 'https://duckduckgo.com';
    }
  },
};