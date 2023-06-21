uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;
uniform float uHoverX;
uniform float uHoverY;

varying vec2 vUv;

void main() {
  // vUv : 0 ~ 1
  vec2 toCenter = vUv - 0.5; // -0.5 ~ 0.5
  float dist = length(toCenter); // 0 ~ 0.5;
  //방향에 따른 질감을 추가하기 위해 내적 사용 , 좀더 자연스러운 웨이브를 위해서 사용 
  //uHoverX, uHoverY : 마우스 포인트와 mesh의 거리가 가까울수록 dir은 0이 되고 
  // 아래에서 이 값을 곱하는 수식이 있으므로 물결효과는 일어나지 않음
  float dir = dot(toCenter, vec2(uHoverX, uHoverY));
  float strength = 1.5; 

  // 0 ~ 0.5 * 20 => 0 ~ 10
    // 물결이 시간에따라 치는 느낌을 주기 위해 uTime 사용
  vec2 wave = vec2(sin(dist* 20.0 - uTime * 5.0), cos(dist* 20.0 - uTime * 5.0));

  // dir안쓰면 중심으로부터 웨이브가 발생해서 중심을 기준으로 원처럼 형성됨.
  // dist 중심으로 부터 거리가 커짐에 따라 웨이브가 커지게 하기 위해서 사용
  //uHover가 0이면 vUv 그대로, 1이면 효과 적용
  vec2 newUv = vUv +  wave * strength * dir * dist * uHover;

  vec4 tex = texture2D(uTexture, newUv);
  gl_FragColor = tex;
}
