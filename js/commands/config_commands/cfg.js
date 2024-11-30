
import { render } from '../../helpers.js';

const formatValue = (value) => {
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return value;
};

const execute = () => {
  const config = window.config;
  let output = '<span class="cyan">Current Configuration:</span>\n';
  
  Object.entries(config).forEach(([section, values]) => {
    output += `\n<span class="purple">${section}:</span>\n`;
    Object.entries(values).forEach(([key, value]) => {
      output += `  <span class="yellow">${key}</span>: <span class="green">${formatValue(value)}</span>\n`;
    });
  });
  
  render(`<pre>${output}</pre>`);
};

export default { execute };