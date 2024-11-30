import Terminal from './terminal.js';

async function initializeApp() {
  try {
    // Load config immediately
    const config = await (await fetch(chrome.runtime.getURL('config.json'))).json();
    window.config = config;

    // Apply critical styles first
    const root = document.documentElement;
    root.style.backgroundImage = `url(${chrome.runtime.getURL(`backgrounds/${config.style.bg.img}`)})`;
    
    // Batch style updates in one frame
    requestAnimationFrame(() => {
      const styles = {
        '--font-family': config.term.font,
        '--font-size': config.term.size,
        '--terminal-opacity': config.style.term_opacity,
        '--shortcuts-opacity': config.style.menu_opacity,
        '--background-blur': config.style.bg.blur
      };
      
      Object.entries(styles).forEach(([prop, value]) => {
        root.style.setProperty(prop, value);
      });

      // Initialize terminal
      const terminal = new Terminal('#input', '#output');
      terminal.init();
      terminal.handleCommand('ls');
    });

  } catch (error) {
    console.error('Initialization error:', error);
    document.body.innerHTML = `<div style="color: var(--red)">Failed to initialize: ${error.message}</div>`;
  }
}

// Use 'DOMContentLoaded' instead of 'load' for faster initialization
document.addEventListener('DOMContentLoaded', initializeApp);
