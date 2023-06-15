precision mediump float;

varying float vRandomPosition;

void main() {
  gl_FragColor = vec4(0.0, vRandomPosition, 1.0, 1.0);
}
