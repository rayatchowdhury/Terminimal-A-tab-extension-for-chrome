import { error, render, fetchWithTimeout } from "./helpers.js";
import shortcuts from "./shortcuts.js";
import { CONFIG } from './config.js';
import { state } from './state.js';

export default {
  search: (options) => {
    const defaultEngine = localStorage.getItem('searchEngine') || CONFIG.SEARCH.DEFAULT;
    const searchUrl = CONFIG.SEARCH.ENGINES[defaultEngine];

    if (options[0] === 'engine') {
      if (!options[1]) {
        render(`Current search engine: ${defaultEngine}`);
        render('Available engines: ' + Object.keys(CONFIG.SEARCH.ENGINES).join(', '));
        return;
      }
      const engine = options[1].toLowerCase();
      if (CONFIG.SEARCH.ENGINES[engine]) {
        localStorage.setItem('searchEngine', engine);
        render(`Search engine set to ${engine}`);
      } else {
        error('yellow', 'Search Error', `Invalid engine. Available: ${Object.keys(CONFIG.SEARCH.ENGINES).join(', ')}`);
      }
      return;
    }

    const query = options.join(" ") || null;
    if (query) {
      window.location.href = searchUrl + encodeURIComponent(query);
    } else {
      render(`No query, redirecting to ${defaultEngine}!`);
      window.location.href = searchUrl.split('?')[0];
    }
  },
  ls: () => {
    if (shortcuts) {
      let shortcutsOutput = '<div class="shortcuts-container">';
      shortcuts.forEach((s) => {
        shortcutsOutput += `<div class="shortcuts"><p class="${s.color}">~/${s.category}</p>`;
        Object.entries(s.items).forEach(([name, link]) => {
          shortcutsOutput += `<p><span class="${s.color}">> </span><a class="shortcut" href="${link}">${name}</a></p>`;
        });
        shortcutsOutput += "</div>";
      });
      render(shortcutsOutput + "</div><br />");
    } else {
      error("yellow", "No Shortcuts", "Add some with the `add` command!");
    }
  },
  help: (cmdList) => {
    // Group commands by category
    const groupedCommands = cmdList.reduce((acc, cmd) => {
      const category = cmd.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(cmd);
      return acc;
    }, {});

    // Get the max length for padding
    const padToLen = Math.max(...cmdList.map(c => c.name.join('|').length));

    // Build help message by category
    let helpMessage = '<p class="cyan">Available Commands:</p>';
    
    Object.entries(groupedCommands).forEach(([category, commands]) => {
      helpMessage += `<p class="yellow">${category}:</p>`;
      commands.forEach(cmd => {
        const paddedCommand = cmd.name
          .join('|')
          .padEnd(padToLen, ' ')
          .replaceAll(' ', '&nbsp;');
        helpMessage += `<p><span class="purple">‣</span>&nbsp;<span class="cyan">${paddedCommand}</span>&nbsp;&nbsp;${cmd.description}</p>`;
      });
      helpMessage += '<br>';
    });

    render(helpMessage, false);
  },
  clear: () => {
    output.innerHTML = "";
    input.focus();
  },
  joke: () => {
    fetch("https://official-joke-api.appspot.com/random_joke")
      .then((res) => res.json())
      .then((data) => {
        render(`${data.setup} - ${data.punchline}`);
      })
      .catch((e) => {
        error("red", "Joke API Error", e.message);
        console.log(e);
        render("Failed to fetch joke. Please try again later.");
      });
  },
  ai: async (options) => {
    if (options[0] === "set" && options[1] === "key") {
      localStorage.setItem("GEMINI_API_KEY", options[2]);
      render("Gemini API key has been set successfully");
      return;
    }

    const GEMINI_API_KEY = localStorage.getItem("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      render(`<p>Usage: ai [set key &lt;key&gt;] [question]</p>
             <p>Please set your API key first using: ai set key YOUR_API_KEY</p>`);
      return;
    }

    const query = options.join(" ");

    if (!state.isInConversation) {
      if (!query) {
        error("yellow", "AI Error", "Please provide a question");
        return;
      }
      state.setConversationState(true);
      render("<p class='yellow'>Starting conversation with Gemini AI. Type 'exit' to end the conversation.</p>");
    }

    if (query.toLowerCase() === 'exit') {
      state.setConversationState(false);
      state.conversationHistory = [];
      render("<p class='yellow'>Ending conversation with Gemini AI.</p>");
      return;
    }

    try {
      const payload = {
        contents: [{
          role: "user",
          parts: [{
            text: query
          }]
        }]
      };

      if (state.conversationHistory.length > 0) {
        payload.contents = [...state.conversationHistory, payload.contents[0]];
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Update conversation history with both user input and AI response
        state.conversationHistory.push(
          {
            role: "user",
            parts: [{ text: query }]
          },
          {
            role: "model",
            parts: [{ text: aiResponse }]
          }
        );

        render(`<p><span class="green">you</span><span>: </span>${query}</p>`);
        render(`<p><span class="cyan">gemini</span><span>: </span>${aiResponse}</p>`);
      } else {
        console.error('API Response:', data);
        error("red", "AI Error", "Invalid response format from API");
      }
    } catch (e) {
      console.error('API Error:', e);
      error("red", "AI Error", e.message);
    }
  },
  contests: async () => {
    try {
      const response = await fetchWithTimeout('https://codeforces.com/api/contest.list');
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error('Failed to fetch contests');
      }

      const upcomingContests = data.result
        .filter(contest => contest.phase === 'BEFORE')
        .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
        .slice(0, 5);

      if (upcomingContests.length === 0) {
        render('No upcoming contests found.');
        return;
      }

      render('<p class="cyan">Upcoming Codeforces Contests:</p>');
      upcomingContests.forEach(contest => {
        const startDate = new Date(contest.startTimeSeconds * 1000);
        const formattedDate = startDate.toLocaleString();
        render(`<p><span class="purple">‣</span> ${contest.name} - <span class="yellow">${formattedDate}</span></p>`);
      });
    } catch (e) {
      error('red', 'Codeforces API Error', e.message);
      console.error(e);
    }
  },
  background: (options) => {
    if (!options || options.length === 0) {
      render(`
        <p>Usage: background [set &lt;url&gt;] [local] [reset]</p>
        <p>Options:</p>
        <p>set   : Set background image URL</p>
        <p>local : Choose a local image file</p>
        <p>reset : Reset to default background</p>
      `, false);
      return;
    }

    if (options[0] === 'local') {
      const fileInput = document.getElementById('bgFileInput');
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target.result;
            localStorage.setItem('background', dataUrl);
            document.getElementsByTagName("html")[0].style.backgroundImage = `url("${dataUrl}")`;
            render('Background image has been updated using local file');
          };
          reader.onerror = () => {
            error('red', 'Background Error', 'Failed to read local file');
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    } else if (options[0] === 'set' && options[1]) {
      const url = options[1];
      const extension = url.split('.').pop().toLowerCase();
      
      if (!CONFIG.UI.BACKGROUND.ALLOWED_EXTENSIONS.includes(extension)) {
        error('red', 'Background Error', 'Invalid image format. Allowed formats: ' + CONFIG.UI.BACKGROUND.ALLOWED_EXTENSIONS.join(', '));
        return;
      }

      // Test image loading before setting
      const testImage = new Image();
      testImage.onerror = () => {
        error('red', 'Background Error', 'Failed to load image. Please check the URL and try again.');
        if (localStorage.getItem('background')) {
          document.getElementsByTagName("html")[0].style.backgroundImage = `url("${localStorage.getItem('background')}")`;
        } else {
          document.getElementsByTagName("html")[0].style.backgroundImage = `url("${CONFIG.UI.BACKGROUND.DEFAULT}")`;
        }
      };
      testImage.onload = () => {
        localStorage.setItem('background', url);
        document.getElementsByTagName("html")[0].style.backgroundImage = `url("${url}")`;
        render('Background image has been updated');
      };
      testImage.src = url;
    } else if (options[0] === 'reset') {
      localStorage.removeItem('background');
      document.getElementsByTagName("html")[0].style.backgroundImage = `url("${CONFIG.UI.BACKGROUND.DEFAULT}")`;
      render('Background image has been reset to default');
    } else {
      error('yellow', 'Background Error', 'Invalid command. Use "background" for usage instructions.');
    }
  },
};
