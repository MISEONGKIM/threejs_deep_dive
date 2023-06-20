// precision mediump float;

uniform sampler2D uTexture;
// varying float vRandomPosition;
// varying vec2 vUv;
in float vRandomPosition;
in vec2 vUv;

out vec4 myFragColor;

void main() {
  // vec4 tex = texture2D(uTexture, vUv); //glsl 1.0
  vec4 tex = texture(uTexture, vUv);
//vRandomPosition이 0~1사이의 값을 하고있으니까 어떤부분은 밝고(1에가까운 값) 어떤부분은 어둡게(0에 가까운 값)
  // gl_FragColor = tex* vRandomPosition; //glsl 1.0

  myFragColor = tex* vRandomPosition;
}
