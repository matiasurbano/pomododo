const moment = require("moment");
const Pomodoro = require("../models/pomodoro");
const config = require("../config");
const chalk = require('chalk');

exports.command = "start";
exports.desc = "start a task";

exports.builder = function builder(yargs) {
  return yargs.usage("Usage: $0 start")
          .alias('t','time')
          .alias('t','Number of minutes for the task')
          .number('t')
          .example("$0 start").argv;
};

exports.handler = function handler(yargs) {
  const { time = config.TASK_LENGTH } = yargs;

  const conf = {
    duration:  moment.duration(time, 'minutes').asMilliseconds(),
    attributes: {}, //TODO: Extend attributes 
    callback : () => {
      console.log("Finished");
    }
  }

  const pommo = new Pomodoro(conf.duration, conf.attributes, conf.callback);
  pommo.start();
  pommo.on('tick', remainininDuration => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(chalk.blue.bold(moment(remainininDuration).format("mm:ss")))
  })

};
