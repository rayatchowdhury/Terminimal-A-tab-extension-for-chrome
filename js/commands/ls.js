import { render } from '../helpers.js';
import shortcuts from '../shortcuts.js';

export default {
  description: 'Lists available shortcuts',
  execute: () => {
    if (shortcuts) {
      let shortcutsOutput = '<div class="grid">';
      shortcuts.forEach((category) => {
        shortcutsOutput += `
          <div class="card">
            <p class="${category.color}">📁 ${category.category}</p>
            ${Object.entries(category.items)
              .map(([name, link]) => `
                <p>
                  <span class="${category.color}">└─ </span>
                  <a class="link" href="${link}">
                    ${name}
                  </a>
                </p>
              `)
              .join('')}
          </div>`;
      });
      render(shortcutsOutput + '</div><br />', false);
    } else {
      render('No shortcuts available. Add some with the `add` command!');
    }
  },
};