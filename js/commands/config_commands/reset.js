import { render } from '../../helpers.js';

const execute = async () => {
  try {
    const response = await fetch(chrome.runtime.getURL('defaultConfig.json'));
    const defaultConfig = await response.json();
    
    window.config = JSON.parse(JSON.stringify(defaultConfig));
    
    // Update DOM
    const root = document.documentElement;
    root.style.setProperty('--font-family', defaultConfig.term.font);
    root.style.setProperty('--font-size', defaultConfig.term.size);
    root.style.setProperty('--terminal-opacity', defaultConfig.style.term_opacity);
    root.style.setProperty('--shortcuts-opacity', defaultConfig.style.menu_opacity);
    root.style.setProperty('--background-blur', defaultConfig.style.bg.blur);
    
    render('<span class="green">Configuration reset to defaults</span>');
  } catch (err) {
    render('<span class="red">Error resetting configuration</span>');
  }
};

export default { execute };