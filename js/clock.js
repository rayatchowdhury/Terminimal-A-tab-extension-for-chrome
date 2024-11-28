
export const setupClock = () => {
  const clockElement = document.createElement('div');
  clockElement.id = 'clock';
  clockElement.className = 'clock';
  document.body.appendChild(clockElement);
  updateClock();
  setInterval(updateClock, 1000);
};

const updateClock = () => {
  const clockElement = document.getElementById('clock');
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const miliseconds = String(now.getMilliseconds()).padStart(3, "0");
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
};