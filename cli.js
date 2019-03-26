#!/usr/bin/env node

/**
 * Command line interface code for the app
 */
const argv = yargs
  .usage('$0 <command>')
  .commandDir('cmds')
  .help('h')
  .alias('h', 'help')
  .version().argv;
