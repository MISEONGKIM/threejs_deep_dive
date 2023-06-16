// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix;

//Material에 속성
uniform float uTime;

//geometary의 attribute들 
// attribute vec3 position; //BufferGeometry에서 제공해주는 정점의 위치값 
// attribute float aRandomPosition;
// attribute vec2 uv; //해당 geometary에 이미 정의된 값

in float aRandomPosition;

// varying float vRandomPosition; //fragment에 넘겨줄 값 
// varying vec2 vUv;
out float vRandomPosition;
out vec2 vUv;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += aRandomPosition / 20.0 * sin(uTime);

  // 2.0 : 파동의크기를 줄여주기 위한 값
  // modelPosition.z += sin(uTime + modelPosition.x) / 2.0;
  vRandomPosition = (aRandomPosition + 1.0) / 2.0; // 0~1 사이값으로 정규화 rgb 값에 사용하기때문에;
   //uTime이 작을 때는 분모가 작으니까 vRandomPosition이 크다. 그래서 밝고
   // uTime이 클 때는 분모가 커지니까 vRandomPosition이 작아진다. 그래서 어두워진다.
  vRandomPosition /= uTime * 0.3;
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

}