import search from './search.js';
import ls from './ls.js';
import help from './help.js';
import clear from './clear.js';
import cfg from './config_commands/cfg.js';
import set from './config_commands/set.js';
import reset from './config_commands/reset.js';

export default {
  search,
  s: search,
  ls,
  help,
  clear,
  cfg,
  set,
  reset,
};