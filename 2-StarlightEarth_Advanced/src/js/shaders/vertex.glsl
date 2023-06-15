uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position; //BufferGeometry에서 제공해주는 정점의 위치값 

void main() {
  // 곱해서 행렬연산 할 수 있도록
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}