varying vec3 vNormal;
uniform float uZoom;

void main() {
  //광원의 위치정보(x좌표, y좌표, z좌표),x좌표에 3.0주면 오른쪽에 있다고 가정(x좌표에 -3.0하면 왼쪽에 있다고 가정)
  vec3 lightSource= vec3(0.0, 0.0, 1.0);

  // 줌을 했을 때 glow가 사라짐. 
  // 줌을 했을 때 glow가 사라지지 않도록 하기 위해 uZoom이란 변수로 물체와 카메라 사이의 값을 받아옴
  // 1.0 나누기 : 가까워질 수록 uZoom값은 작아짐. 그래서 가장자리 빛이 가까우면 사라짐, 멀수록 밝아짐. 
  // 이걸 반전시키기 위해서 1.0 나누기를 해주면 멀면 가장자리 빛이 사라지고 가까우면 밝아짐
  // pow : 빛을 더 빛나게 하기 위해 , 값을 키우기 위해 사용
  // max : 멀면 빛이 사라지니까 1.0보다 작아지면 1.0으로 적용되도록 하여 멀어도 빛이나게 적용
  float strength = max(1.0, pow(1.0 / (uZoom / 2.0), 5.0));

 // 0.8 빼기 : 안하면 가장자리가 가장 밝고 지구랑 가까운 쪽이 어두움. 지구랑 가까운 쪽이 밝게 해주기 위해 반전 시켜주는 거임  
  //pow() : 흐린부분은 더 흐릿, 밝은 부분은 더 밝게 하기 위해
  // strength : 줌인이 되더라도 glow가 안사라지도록
   float intensity = pow(0.8 - dot(vNormal, lightSource), 5.0) * strength;

  vec3 greenCol = vec3(0.246, 0.623, 0.557);

// 기존 색상에 빛의 강도를 적용해서 광원과 가까운 부분은 더 밝게, 멀리있는 부분은 더 어둡게 적용
  gl_FragColor = vec4(greenCol, 1.0) * intensity;
}