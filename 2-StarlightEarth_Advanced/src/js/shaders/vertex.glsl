uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
//Material에 속성
uniform float uTime;

//geometary의 attribute들 
attribute vec3 position; //BufferGeometry에서 제공해주는 정점의 위치값 
attribute float aRandomPosition;

varying float vRandomPosition; //fragment에 넘겨줄 값 


void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += aRandomPosition * uTime;
  vRandomPosition = (aRandomPosition + 1.0) / 2.0; // 0~1 사이값으로 정규화 rgb 값에 사용하기때문에;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

}