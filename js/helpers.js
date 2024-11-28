import { CONFIG } from './config.js';
import { state } from './state.js';

const render = (text, needsMarkup = true) => {
  if (needsMarkup) {
    output.innerHTML += `<p>${text}</p>`;
  } else {
    output.innerHTML += text;
  }
  input.focus();
};

const error = (color, type, message) => {
  render(`<p><span class="${color}">${type}</span>: ${message}</p>`);
};

export class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

export const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    if (!response.ok) {
      throw new APIError(`HTTP error! status: ${response.status}`, response.status);
    }
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const getDate = () => {};

export { render, error, getDate };
