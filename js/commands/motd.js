
import { render } from '../helpers.js';

export default {
  description: 'Displays a random quote',
  execute: () => {
    const cachedQuote = localStorage.getItem('cachedQuote');
    const isCachedValid = cachedQuote && (Date.now() - JSON.parse(cachedQuote).timestamp) < 12 * 60 * 60 * 1000;

    if (isCachedValid) {
      const quote = JSON.parse(cachedQuote);
      render(`"${quote.content}" - ${quote.author}`);
    } else {
      fetch('https://api.quotable.io/random?tags=technology')
        .then((res) => res.json())
        .then((data) => {
          render(`"${data.content}" - ${data.author}`);
          localStorage.setItem('cachedQuote', JSON.stringify({ ...data, timestamp: Date.now() }));
        })
        .catch(() => {
          render('Could not fetch quote at this time.');
        });
    }
  },
};