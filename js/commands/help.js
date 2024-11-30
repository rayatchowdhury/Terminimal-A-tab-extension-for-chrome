
import { render } from '../helpers.js';
import commands from './index.js';

export default {
  description: 'Lists available commands',
  execute: () => {
    let helpMessage = '';
    for (const [name, command] of Object.entries(commands)) {
      if (command.description) {
        helpMessage += `<p><span class="cyan">${name}</span>: ${command.description}</p>`;
      }
    }
    render(helpMessage, false);
  },
};