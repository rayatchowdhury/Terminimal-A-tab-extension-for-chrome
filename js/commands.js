import executor from "./executors.js";

export default [
  {
    name: ["help"],
    description: "Lists available commands",
    category: "System",
    execute: executor.help,
  },
  {
    name: ["ls"],
    description: "Lists available shortcuts",
    category: "System",
    execute: executor.ls,
  },
  {
    name: ["clear"],
    description: "Clears the output history",
    category: "System",
    execute: executor.clear,
  },
  {
    name: ["search", "s"],
    description: "Searches web (usage: search [engine <name>] [query] - supported engines: duckduckgo, google, bing, brave)",
    category: "Web",
    execute: executor.search,
  },
  {
    name: ["ai"],
    description: "Ask Gemini AI a question",
    category: "Web",
    execute: executor.ai,
  },
  {
    name: ["joke"],
    description: "Displays a random joke",
    category: "Fun",
    execute: executor.joke,
  },
  {
    name: ["contests", "cf"],
    description: "Shows upcoming Codeforces contests",
    category: "Info",
    execute: executor.contests,
  },
  {
    name: ["background", "bg"],
    description: "Set background image URL",
    category: "System",
    execute: executor.background,
  }
];
