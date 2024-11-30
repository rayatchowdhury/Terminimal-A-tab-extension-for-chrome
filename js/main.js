import Terminal from './terminal.js';

let config;

async function loadConfig() {
  const response = await fetch(chrome.runtime.getURL('config.json'));
  return await response.json();
}

async function initializeApp() {
  try {
    config = await loadConfig();
    window.config = config;
    
    const terminal = new Terminal('#input', '#output');
    terminal.init();
    terminal.handleCommand('ls');

    // Simplified background handling
    const bgUrl = chrome.runtime.getURL(`backgrounds/${config.style.bg.img}`);
    document.documentElement.style.backgroundImage = `url("${bgUrl}")`;
    
    // Apply other styles
    const root = document.documentElement;
    root.style.setProperty('--font-family', config.term.font);
    root.style.setProperty('--font-size', config.term.size);
    root.style.setProperty('--terminal-opacity', config.style.term_opacity);
    root.style.setProperty('--shortcuts-opacity', config.style.menu_opacity);
    root.style.setProperty('--background-blur', config.style.bg.blur);
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

window.addEventListener('load', initializeApp);
