import { render, error } from './helpers.js';
import commands from './commands/index.js';

export default class Terminal {
  constructor(inputSelector, outputSelector) {
    this.input = document.querySelector(inputSelector);
    this.output = document.querySelector(outputSelector);
  }

  init() {
    // Set prompt values from config
    document.getElementById('username').textContent = window.config.term.user;
    document.getElementById('hostname').textContent = window.config.term.host;
    document.getElementById('directory').textContent = window.config.term.dir;

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputValue = this.input.value;
        this.handleCommand(inputValue);
        this.input.value = '';
      }
    });
    // ...existing code...
  }

  handleCommand(inputValue) {
    const [commandName, ...args] = inputValue.trim().split(' ');
    render(`<span class="red">$&nbsp;</span>${inputValue}`);

    const command = commands[commandName.toLowerCase()];
    if (command) {
      try {
        command.execute(args);
        // Updated selector and added error handling
        setTimeout(() => {
          const terminal = document.querySelector('.scroll');
          if (terminal) {
            terminal.scrollTop = terminal.scrollHeight;
          }
        }, 100);
      } catch (err) {
        error('red', 'Error', err.message);
      }
    } else {
      error('yellow', commandName, 'command not found');
    }
  }
}