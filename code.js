const ioHook = require("ioHook");
const fs = require("fs");

let output = {
  keypresses: [],
};

function startLogging(full) {
  ioHook.start();
  ioHook.on("keydown", (event) => {
    if (full) {
      let press = {
        0: event.shiftKey,
        1: event.altKey,
        2: event.ctrlKey,
        3: event.metaKey,
        4: event.keycode,
        5: event.rawcode,
      };
      output.keypresses.push(press);
    }

    if (!full) {
      let press = event.keycode;
      output.keypresses.push(press);
    }
  });
}

function save() {
  fs.writeFile("./output.txt", JSON.stringify(output), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("saved!");
  });
}

setInterval(function () {
  save();
}, 900000);

startLogging(false);
