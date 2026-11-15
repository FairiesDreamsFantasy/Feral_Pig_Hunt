/**
 * System/Keyboards_and_Controllers/Engine/Languages/index.tsx
 * Keyboard and controller hardware poll mappings across standard languages.
 */

export const Assembly = {
  biosPoll: '; BIOS interrupt INT 16h - read keyboard character',
  pollCode: 'mov ah, 01h; int 16h; jz no_key_pressed'
};

export const Basic = {
  inkey: '10 K$ = INKEY$: IF K$ = "" THEN GOTO 10'
};

export const C = {
  pollX11: 'XNextEvent(display, &event); if(event.type == KeyPress) { handle_input(event.xkey.keycode); }'
};

export const PHP = {
  readStdin: '$handle = fopen("php://stdin", "r"); $line = fgets($handle);'
};

export const SQL = {
  logCommand: 'INSERT INTO user_inputs (key_code, pressed_timestamp) VALUES ("SPACE", NOW());'
};

export const Rust = {
  crossterm: '// read raw terminal input via crossterm crate\nif let Event::Key(key_event) = event::read().unwrap() {}'
};

export const ThreeDJS = {
  domKeyboard: 'window.addEventListener("keydown", (event) => { keyboard.press(event.code); });'
};

export default {
  Assembly,
  Basic,
  C,
  PHP,
  SQL,
  Rust,
  ThreeDJS,
};
