/**
 * System/Sound/Engine/Languages/index.tsx
 * Sound/Audio synthesizer language bindings.
 * Direct code blocks for playing audio/music in various languages.
 */

export const Assembly = {
  driver: '; play PCM audio track on vintage speaker port 61h',
  playBeep: 'mov al, 182; out 43h, al; mov ax, 912; out 42h, al; mov al, ah; out 42h, al'
};

export const Basic = {
  beep: '10 PLAY "T120 L4 O3 C D E F G A B"'
};

export const C = {
  header: '/* PortAudio C audio play loop */',
  init: 'Pa_Initialize(); Pa_OpenDefaultStream(&stream, 0, 2, paFloat32, 44100, 256, playCallback, NULL);'
};

export const PHP = {
  cmd: '<?php exec("aplay /var/sound/beep.wav"); ?>'
};

export const SQL = {
  auditSoundTrigger: 'INSERT INTO audio_logs (event_name, volume) VALUES ("pig_squeal_decibel", 90);'
};

export const Rust = {
  rodio: '// rodio safe audio stream\nlet (_stream, handle) = OutputStream::try_default().unwrap();'
};

export const ThreeDJS = {
  audio: 'const sound = new THREE.Audio(listener); const audioLoader = new THREE.AudioLoader();'
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
