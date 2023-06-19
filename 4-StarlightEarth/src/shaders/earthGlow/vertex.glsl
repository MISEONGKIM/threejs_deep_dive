varying vec3 vNormal;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

// 1보다 크지않게 정규화 : normalize(), normalMatrix 
  vNormal = normalize(normalMatrix * normal); 

}