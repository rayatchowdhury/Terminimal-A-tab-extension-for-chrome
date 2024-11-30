import { render, error } from './helpers.js';
import commands from './commands/index.js';

export default class Terminal {
  constructor(inputSelector, outputSelector) {
    this.input = document.querySelector(inputSelector);
    this.output = document.querySelector(outputSelector);
    this.history = [];
    this.historyIndex = -1;
  }

  init() {
    // Set prompt values from config
    document.getElementById('username').textContent = window.config.term.user;
    document.getElementById('hostname').textContent = window.config.term.host;
    document.getElementById('directory').textContent = window.config.term.dir;

    this.input.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
          const inputValue = this.input.value;
          if (inputValue.trim()) {
            this.history.push(inputValue);
            this.historyIndex = this.history.length;
          }
          this.handleCommand(inputValue);
          this.input.value = '';
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          if (this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.history[this.historyIndex];
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.input.value = this.history[this.historyIndex];
          } else {
            this.historyIndex = this.history.length;
            this.input.value = '';
          }
          break;
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