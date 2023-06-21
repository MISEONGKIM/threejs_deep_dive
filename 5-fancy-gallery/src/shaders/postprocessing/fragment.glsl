uniform sampler2D tDiffuse; //전체화면 텍스처의 정보
uniform float uTime;

varying vec2 vUv;

// 1. ripple
// void main() {
//   vec2 toCenter = vUv - 0.5; // -0.5 ~ 0.5
//   float dist = length(toCenter); // 0 ~ 0.5;
 
//   float dir = dot(toCenter, vec2(1.0, 1.0));
//   float strength = 0.05; 


//   vec2 wave = vec2(sin(dist* 20.0 - uTime * 5.0), cos(dist* 20.0 - uTime * 5.0));
//   vec2 newUv = vUv +  wave * strength * dir * dist;
  
//   vec4 tex = texture2D(tDiffuse, newUv);

//   gl_FragColor = tex;
// }

// 2.side 
// void main() {
//   vec2 newUv = vUv;
//   // float side = smoothstep(0.2, 0.0, newUv.x) + smoothstep(0.8, 1.0, newUv.x);
//   // newUv.y -= (newUv.y - 0.5) * side * 0.1;
//   // 0 ~ 0.4 사이에는 색상이 보이고 0.4 ~ 1 사이에는 검은색
//   float side = smoothstep(0.4, 0.0, newUv.y);
//   newUv.x -= (newUv.x - 0.5) * side * 0.1;
  
//   vec4 tex = texture2D(tDiffuse, newUv);
   
//   gl_FragColor = tex ;
// }

// 3. noise 
void main () {
  vec2 newUv = vUv;
  vec4 tex = texture2D(tDiffuse, newUv);

  gl_FragColor = tex;
}