/**
 * System/Visuals/Engine/Languages/index.tsx
 * Visual rendering and coordinate drawing language bindings.
 */

export const Assembly = {
  vgaDraw: '; Plot pixel directly on Mode 13h VGA memory segment A000h',
  plotPixel: 'mov ax, 0A000h; mov es, ax; mov di, pixel_offset; mov al, color_index; mov es:[di], al'
};

export const Basic = {
  screen: '10 SCREEN 13: REM SET MODE 13H VGA 320X200 256 COLORS',
  line: '20 LINE (10, 10)-(100, 100), 14, BF: REM DRAW FILLED YELLOW BOX'
};

export const C = {
  opengl: 'glBegin(GL_TRIANGLES); glVertex3f(-1.0f, -1.0f, 0.0f); glVertex3f(1.0f, -1.0f, 0.0f); glEnd();'
};

export const PHP = {
  gdImage: '<?php $im = imagecreatetruecolor(320, 200); $red = imagecolorallocate($im, 255, 0, 0); imagefill($im, 0, 0, $red); ?>'
};

export const SQL = {
  fetchTextures: 'SELECT width, height, raw_pixels FROM textures WHERE name = "retro_crt_bloom";'
};

export const Rust = {
  pixels: '// draw pixels on a tiny frame buffer\nfor (i, pixel) in frame.chunks_exact_mut(4).enumerate() {}'
};

export const ThreeDJS = {
  scene: 'const scene = new THREE.Scene(); const mesh = new THREE.Mesh(geometry, material); scene.add(mesh);'
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
