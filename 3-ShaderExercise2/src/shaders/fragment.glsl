precision mediump float;

varying vec2 vUv;

void main()
{
    // 1. 그라데이션 
//     float x = vUv.x; //x 좌표, 0.0 ~ 1.0
//     float y = vUv.y; //y 좌표

//    //왼쪽은 검은색 오른쪽으로 갈수록 하얀색이 됨.
//     float col = x;
//     gl_FragColor = vec4(col, col, col, 1.0);

    // 2. 대각선 만들기
//     float x = vUv.x; 
//     float y = vUv.y; 

//    vec3 col = vec3(x);
//    vec3 green= vec3(0.0, 1.0, 0.0);

//    if (y <= x + 0.005 && y + 0.005 >= x) {
//     col = green;
//    }
//     gl_FragColor = vec4( col, 1.0);

    //3. 곡선 만들기
    float x = vUv.x; 
    float y = vUv.y; 

   vec3 col = vec3(x);
   vec3 green= vec3(0.0, 1.0, 0.0);
    float a = 2.0;

   if (y  <= x * a ) {
    col = green;
   }
    gl_FragColor = vec4( col, 1.0);
}