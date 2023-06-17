uniform float uBrightness;
uniform vec2 uPosition;
uniform vec3 uColor;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    //새로운 uv생성해서 좌표 수정
    // 지구가 왼쪽으로 0.2만큼 이동, UV의 값이 0 ~ 1 사이에서 0.2 ~ 1.2사이로 바꼈기 때문
    // 이에 따라 텍스처를 매핑하는 과정에서 0부터 0.2사이만큼 밀린 거
    // 원래있던 텍스처에 (0,0) 에서부터 샘플링 되던 게 (0.2, 0) 에서부터 샘플링이 되면서 1을 초과하는 1에서 1.1사이의 텍스처는 외곡되는 것 처럼 보임
    // 이렇게 UV값을 변형을 주는 건  디스토션이라는 외곡효과를 줄 때 자주 사용하는 기법 중에 하나 
    // vec2 newUV = vec2(vUv.x + 0.2, vUv.y); 

  vec2 newUV = vec2(vUv.x, vUv.y); 

  vec4 tex = texture2D(tDiffuse, newUV);
    tex.rgb += uColor;

  //더 빛나게 
    // brightness 값이 더 작아질 수록 tex의 값은 더 높아질 거고 높아진 만큼 더 하얗게, 즉 더 밝아짐
    // float brightness = 0.1;

  // 왼쪽이 엄청 밝은 느낌 
    // uBrightness값이 0이면 , sin에서  vUv.x 값이 0일때는 brightness값도 0 이므로 굉장히 밝아짐 , 반면에 좌표가 증가할 수록 1에 가까워지므로 어두움 
  float brightness = sin(uBrightness + vUv.x);
    

  gl_FragColor = tex / brightness;
}