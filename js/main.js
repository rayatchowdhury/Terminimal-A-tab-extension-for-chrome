import Terminal from './terminal.js';

const terminal = new Terminal('#input', '#output');

window.addEventListener('load', () => {
  terminal.init();
  terminal.handleCommand('ls');
  let filenames = ["purple-mountains.jpg"];
  let root = document.getElementsByTagName("html")[0];
  root.style.backgroundImage = `url("./backgrounds/${
    filenames[Math.floor(Math.random() * filenames.length)]
  }")`;
  root.style.backgroundSize = "cover";
  root.style.backgroundPosition = "center";
});
