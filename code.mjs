import { GlobalKeyboardListener } from "node-global-key-listener";
import * as fs from "fs";

const globalKbListener = new GlobalKeyboardListener();

let keyPressTally = {};
let keyPressNames = {
  BACKSLASH: "\\",
  BACKSPACE: "BACKSPACE",
  "CAPS LOCK": "CAPS_LOCK",
  COMMA: ",",
  DELETE: "DELETE",
  DOT: ".",
  END: "END",
  EQUALS: "=",
  ESCAPE: "ESC",
  "FORWARD SLASH": "/",
  HOME: "HOME",
  INS: "INSERT",
  "LEFT ALT": "LEFT_ALT",
  "LEFT SHIFT": "LEFT_SHIFT",
  MINUS: "-",
  "NUM LOCK": "NUM_LOCK",
  "NUMPAD 1": "NUM_1",
  "NUMPAD 2": "NUM_2",
  "NUMPAD 3": "NUM_3",
  "NUMPAD 4": "NUM_4",
  "NUMPAD 5": "NUM_5",
  "NUMPAD 6": "NUM_6",
  "NUMPAD 7": "NUM_7",
  "NUMPAD 8": "NUM_8",
  "NUMPAD 9": "NUM_9",
  "NUMPAD 0": "NUM_0",
  "NUMPAD DIVIDE": "NUM_DIVIDE",
  "NUMPAD MINUS": "NUM_MINUS",
  "NUMPAD MULTIPLY": "NUM_MULTIPLY",
  "NUMPAD PLUS": "NUM_PLUS",
  "PAGE DOWN": "PAGE_DOWN",
  "PAGE UP": "PAGE_UP",
  "PRINT SCREEN": "PRTSCR",
  QUOTE: "'",
  RETURN: "RETURN",
  "RIGHT SHIFT": "RIGHT_SHIFT",
  "SCROLL LOCK": "SCROLL_LOCK",
  SECTION: "SECTION",
  SEMICOLON: ";",
  "SQUARE BRACKET CLOSE": "]",
  "SQUARE BRACKET OPEN": "[",
  TAB: "TAB",
  "UP ARROW": "UP",
  "LEFT ARROW": "LEFT",
  "DOWN ARROW": "DOWN",
  "RIGHT ARROW": "RIGHT",
};
let keyPressCounter = 0;

// Read the previously logged keys and put them in the keyPresses array before starting
fs.readFile("./output.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
    console.log("There's probably no output file yet :)");
    return;
  }
  keyPressTally = JSON.parse(data);
  console.log(keyPressTally);
});

// Listen for keypresses and process them
globalKbListener.addListener(function (e, down) {
  // If we listen for DOWN it registers for as long as the key is pressed
  if (e.state === "UP") {
    keyPressCounter++;
    keyPressTally[keyPressNames[e.name] || e.name] ??= 0;
    keyPressTally[keyPressNames[e.name] || e.name]++;
    if (keyPressCounter >= 20) {
      save();
      keyPressCounter = 0;
    }
  }
});

// Save logged keys to file
function save() {
  fs.writeFile(
    "./output.txt",
    JSON.stringify(keyPressTally, Object.keys(keyPressTally).sort()),
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("saved!");
    }
  );
}
//
