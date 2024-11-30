
import { render, error, getWeather } from '../helpers.js';

export default {
  description: 'Displays the current weather forecast',
  execute: (args) => {
    if (!args.length) {
      getWeather();
    } else if (args[0] === 'set') {
      if (args[1] === 'key') {
        localStorage.setItem('WEATHER_API_KEY', args[2]);
        render(`Weather API key set to ${args[2]}`);
      } else if (args[1] === 'loc') {
        localStorage.setItem('loc', args.slice(2).join(' '));
        render(`Location set to ${args.slice(2).join(' ')}`);
      } else {
        render('Usage: weather [set key <key>] [set loc <location>]');
      }
    } else {
      render('Usage: weather [set key <key>] [set loc <location>]');
    }
  },
};