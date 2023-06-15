varying vec2 vUv;

void main() {
 gl_Position  = vec4(position.x, position.y, 0.0, 1.0);
 vUv = uv;
}