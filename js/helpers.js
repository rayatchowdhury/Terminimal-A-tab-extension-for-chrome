const render = (text, needsMarkup = true) => {
  const output = document.getElementById('output');
  if (needsMarkup) {
    output.innerHTML += `<p>${text}</p>`;
  } else {
    output.innerHTML += text;
  }
  input.focus();
};

const error = (color, type, message) => {
  render(`<span class="${color}">${type}</span>: ${message}`);
};

export { render, error };
