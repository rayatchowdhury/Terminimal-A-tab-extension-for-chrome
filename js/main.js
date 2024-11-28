import { CONFIG } from './config.js';
import { state } from './state.js';
import commands from './commands.js';
import executors from './executors.js';
import { error } from './helpers.js';
import shortcuts from "./shortcuts.js";

const input = document.getElementById("input");
const output = document.getElementById("output");

const render = (text, needsMarkup = true) => {
  if (needsMarkup) {
    output.innerHTML += `<p>${text}</p>`;
  } else {
    output.innerHTML += text;
  }
  input.focus();
};

const updateClock = () => {
  const clockElement = document.getElementById("clock");
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
};

const initializeApp = () => {
  executors.ls();
  setupBackground();
  setupClock();
};

const setupBackground = () => {
  const root = document.getElementsByTagName("html")[0];
  const bgUrl = localStorage.getItem("background") || CONFIG.UI.BACKGROUND.DEFAULT;
  console.log('Setting up background with URL:', bgUrl); // Debug log
  
  root.style.backgroundSize = "cover";
  root.style.backgroundPosition = "center";
  root.style.backgroundRepeat = "no-repeat";
  
  const img = new Image();
  img.onerror = () => {
    console.error('Failed to load background image:', bgUrl);
    if (bgUrl !== CONFIG.UI.BACKGROUND.DEFAULT) {
      console.log('Falling back to default background');
      localStorage.removeItem("background");
      root.style.backgroundImage = `url("${CONFIG.UI.BACKGROUND.DEFAULT}")`;
    }
  };
  img.onload = () => {
    console.log('Background image loaded successfully'); // Debug log
    root.style.backgroundImage = `url("${bgUrl}")`;
  };
  img.src = bgUrl;
};

const setupClock = () => {
  const clockElement = document.createElement("div");
  clockElement.id = "clock";
  clockElement.className = "clock";
  document.body.appendChild(clockElement);
  updateClock();
  setInterval(updateClock, 1000);
};

input.addEventListener("keydown", function (e) {
  console.log("Keydown event detected"); // Add this line for debugging
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent the default action only for Enter key
    const userInput = input.value.trim().split(" ");
    const command = userInput[0].toLowerCase();
    const options = userInput.slice(1);
    
    // Check if we're in a conversation with AI
    if (window.isInConversation) {
      executors.ai(userInput);
    } else {
      render(`<span class="green">rayat</span><span>@</span><span class="cyan">persephone</span><span>:</span><span class="purple">~</span><span class="red">$&nbsp;</span>${input.value}`);
      try {
        const commandDetails = commands.find((c) =>
          c.name.map((n) => n.toLowerCase()).includes(command)
        );
        if (commandDetails) {
          if (command === "help") commandDetails.execute(commands);
          else commandDetails.execute(options);
        } else {
          const shortcutDetails = shortcuts
            .flatMap((c) => Object.entries(c.items))
            .find(([i]) => i.toLowerCase().startsWith(command));
          if (shortcutDetails) {
            console.log(shortcutDetails);
            render(`Redirecting to ${shortcutDetails[0]}...`);
            window.location.href = shortcutDetails[1];
          } else error("yellow", command, "command not found");
        }
      } catch (e) {
        error("red", "JS Error", e.message);
      }
    }
    input.value = "";
  }
});

window.addEventListener("load", initializeApp);
