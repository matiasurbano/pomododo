const moment = require("moment");
const Pomodoro = require("../models/pomodoro");
const blessed = require("blessed");
const config = require("../config");
const chalk = require("chalk");
const ioManager = require("../utils/ioManager");

exports.command = "start";
exports.desc = "start a task";

exports.builder = function builder(yargs) {
  return yargs
    .usage("Usage: $0 start")
    .alias("t", "time")
    .alias("t", "Number of minutes for the task")
    .number("t")
    .example("$0 start").argv;
};

exports.handler = function handler(yargs) {
  const { time = config.TASK_LENGTH } = yargs;

  const screen = ioManager.screen;
  const box = ioManager.box;

  // const timerLabel = blessed.box({
  //   parent: box,
  //   tags: false,
  //   top: 0,
  //   left: 0,
  //   height: 2,
  // });

  const header = blessed.box({
    parent: box,
    tags: false,
    bottom: 0,
    left: 0,
    height: 1,
  });

  const footer = blessed.box({
    parent: box,
    tags: false,
    bottom: 0,
    left: 0,
    height: 1,
  });

  function showFooter(status) {
    footer.show()
    footer.setContent(status)
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
  showFooter('[ESC] / [q] / [C-c] Exit  |  [s] Stop');

  // Focus our element.
  box.focus();

  // Render the screen.
  screen.render();

  const conf = {
    duration: moment.duration(time, "minutes").asMilliseconds(),
    attributes: {}, //TODO: Extend attributes
    callback: () => {
      console.log("Finished");
    }
  };

  const pommo = new Pomodoro(conf.duration, conf.attributes, conf.callback);
  pommo.start();
  pommo.on("tick", remainininDuration => {

  //  process.stdout.write(
  //     chalk.blue.bold(moment(remainininDuration).format("mm:ss"))
  //   );
  //   box.setContent(chalk.blue.bold(moment(remainininDuration).format("mm:ss")));

    showStatusBar(moment(remainininDuration).format("mm:ss"));
    
    // process.stdout.clearLine();
    // process.stdout.cursorTo(0);
    // process.stdout.write(
    //   chalk.blue.bold(moment(remainininDuration).format("mm:ss"))
    // );
  });
};
