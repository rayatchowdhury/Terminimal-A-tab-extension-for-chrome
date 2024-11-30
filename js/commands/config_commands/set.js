import { render, error } from '../../helpers.js';

const execute = (args) => {
  if (args.length < 2) {
    error('red', 'Usage', 'set <path> <value> (e.g., set term.font "Arial")');
    return;
  }

  const path = args[0];
  const value = args.slice(1).join(' ').replace(/^["']|["']$/g, '');
  
  try {
    const keys = path.split('.');
    let current = window.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) throw new Error(`Invalid path: ${path}`);
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    if (!(lastKey in current)) throw new Error(`Invalid path: ${path}`);
    
    current[lastKey] = value;
    
    // Update DOM if needed
    const root = document.documentElement;
    switch (path) {
      case 'term.user':
        document.getElementById('username').textContent = value;
        break;
      case 'term.font':
        root.style.setProperty('--font-family', value);
        break;
      case 'term.size':
        root.style.setProperty('--font-size', value);
        break;
      case 'style.term_opacity':
        root.style.setProperty('--terminal-opacity', value);
        break;
      case 'style.menu_opacity':
        root.style.setProperty('--shortcuts-opacity', value);
        break;
      case 'style.bg.blur':
        root.style.setProperty('--background-blur', value);
        break;
    }
    
    render(`<span class="green">Successfully set ${path} to ${value}</span>`);
  } catch (err) {
    error('red', 'Error', err.message);
  }
};

export default { execute };