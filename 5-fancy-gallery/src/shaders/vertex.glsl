uniform float uTime;
uniform float uHover;
uniform float uHoverX;
uniform float uHoverY;


varying vec2 vUv;

void main() {
/* 이미지 모양이 사각형인데 hover하면 모양도 물결치는거 처럼 펄럭이게 하기 위해 wave 추가*/
  vec2 toCenter = uv - 0.5; 
  float dist = length(toCenter); 
  float dir = dot(toCenter, vec2(uHoverX, uHoverY));
  float strength = 5.0; 

  float wave = sin(dist* 20.0 - uTime * 5.0);

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += wave * dist * dir * strength * uHover;
  
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  vUv = uv;
}