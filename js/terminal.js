
import { render, error } from './helpers.js';
import commands from './commands/index.js';

export default class Terminal {
  constructor(inputSelector, outputSelector) {
    this.input = document.querySelector(inputSelector);
    this.output = document.querySelector(outputSelector);
  }

  init() {
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
      } catch (err) {
        error('red', 'Error', err.message);
      }
    } else {
      error('yellow', commandName, 'command not found');
    }
  }
}