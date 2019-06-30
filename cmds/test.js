const blessed = require("blessed");
const ioManager = require("../utils/ioManager");

exports.command = "test";
exports.desc = "test desc";

exports.builder = function builder(yargs) {
  return yargs.usage("Usage: $0 test").example("$0 test").argv;
};

exports.handler = function handler(yargs) {
  const screen = ioManager.screen;
  const box = ioManager.box;

  const statusBar = blessed.box({
    parent: box,
    tags: false,
    bottom: 0,
    left: 0,
    height: 1,
  });

  function showStatusBar(status) {
    statusBar.show()
    statusBar.setContent(status)
    screen.render()
  }

  // Append our box to the screen.
  screen.append(box);

  // Quit on Escape, q, or Control-C.
  screen.key(["escape", "q", "C-c"], function(ch, key) {
    return process.exit(0);
  });

  box.setContent(
    "{right}Even different {black-fg}content{/black-fg}.{/right}\n"
  );
  showStatusBar('[ESC] / [q] / [C-c] Exit  |  [s] Stop');

  // Focus our element.
  box.focus();

  // Render the screen.
  screen.render();
};
