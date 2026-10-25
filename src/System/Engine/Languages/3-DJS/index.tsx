/**
 * System/Engine/Languages/3-DJS Module
 * ThreeJS visual mappings, WebGL shaders, perspective cameras, and point cloud vectors.
 */

export const THREE_JS_BINDING = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    void main() {
        gl_FragColor = vec4(0.0, 0.9, 0.1, 1.0); // Phosphor Retro Green color
    }
  `,
  cameraSetup: 'const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);'
};

export default THREE_JS_BINDING;
