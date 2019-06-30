const blessed = require("blessed");

// Create a screen object.
var screen = blessed.screen({
  fullUnicode: true, // emoji or bust
  smartCSR: true,
  autoPadding: true,
  title: "Pomododo"
});

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
  parent: screen,
  label: "Pomododo 🍅",
  tags: true,
  top: "center",
  left: "center",
  border: {
    type: "line"
  },
  style: {
    fg: "white",
    border: {
      fg: "red"
    }
  }
});

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

module.exports = {
  screen,
  box,
  header,
  footer
};
