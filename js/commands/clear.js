
export default {
  description: 'Clears the terminal output',
  execute: () => {
    const output = document.getElementById('output');
    output.innerHTML = '';
  },
};