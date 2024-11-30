import { render } from '../helpers.js';
import shortcuts from '../shortcuts.js';

export default {
  description: 'Lists available shortcuts',
  execute: () => {
    if (shortcuts) {
      let shortcutsOutput = '<div class="shortcuts-container">';
      shortcuts.forEach((category) => {
        shortcutsOutput += `
          <div class="shortcuts">
            <p class="${category.color}">📁 ${category.category}</p>
            ${Object.entries(category.items)
              .map(([name, link]) => `
                <p>
                  <span class="${category.color}">└─ </span>
                  <a class="shortcut" href="${link}">
                    ${name}
                  </a>
                </p>
              `)
              .join('')}
          </div>`;
      });
      render(shortcutsOutput + '</div><br />', false);
      
      // Scroll to bottom after rendering
      setTimeout(() => {
        const terminal = document.querySelector('.scrollable');
        terminal.scrollTop = terminal.scrollHeight;
      }, 100);
    } else {
      render('No shortcuts available. Add some with the `add` command!');
    }
  },
};