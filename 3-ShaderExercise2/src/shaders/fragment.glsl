precision mediump float;

varying vec2 vUv;
float smoothy(float edge0, float edge1, float x) {
    // 0.3에서 0.7까지 그라데이션 만들기 
    //x가 0.3이면 0, 0.7이면 1로 만들어주기 
    float t = clamp((x - 0.3) / (0.7- 0.3),0.0,1.0);

   // clamp만든 그라데이션을 좀 더 부드럽게 적용
    float strength = t * t * (3.0 - 2.0 * t);

    return strength;
}

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
//     float x = vUv.x * 2.0; 
//     float y = vUv.y; 

//    vec3 col = vec3(x * x);
//    vec3 green= vec3(0.0, 1.0, 0.0);
//     float a = 2.0;

//    if (y  >= x * x && y - 0.005 <= x * x) {
//     col = green;
//    }
//     gl_FragColor = vec4( col, 1.0);
 
 //4. step
//     float x = vUv.x;
//     float y = vUv.y;

//    // x가 0.5보다 작으면 0, 크면 1
//     float strength = step(0.5, x);
    
//     if (strength === 0.0) {
//         discard;
//     }

//     vec3 col = vec3(strength);
    
//     gl_FragColor = vec4(col, 1.0);

//  5. min, max 
//     float x = vUv.x;
//     float y = vUv.y;

//    // x가 0.5보다 작으면 x, 크면 최소값인 0.5 반환, 즉 0.5보다 작을땐 x좌표값에 따른 그라데이션(검은색에서 회색)
//     float strength = min(0.5, x);

//     // x가 0.5보다 크면 x, 작으면 최소값인 0.5 반환 , 즉 0.5보다 클땐 x좌표값에 따른 그라데이션(회색에서 흰색)
//     float strength = max(0.5, x);

//     vec3 col = vec3(strength);
    
//     gl_FragColor = vec4(col, 1.0);

// 6. clamp
//     float x = vUv.x;
//     float y = vUv.y;

//    // 기준값, 하한선(이 값보다 작은 경우 해당 값 반환), 상한선(이 값보다 커지는 경우 해당 값 반환)
//     float strength = clamp(x, 0.0, 1.0);

//     vec3 col = vec3(strength);
    
//     gl_FragColor = vec4(col, 1.0);

// 7. smoothstep
    // float x = vUv.x;
    // float y = vUv.y;

    // // float strength = smoothy(0.3, 0.7, x);
    // float strength = smoothstep(0.3, 0.7, x);
    // vec3 col = vec3(strength);
    
    // gl_FragColor = vec4(col, 1.0);

   // 8.mix
    float x = vUv.x;
    float y = vUv.y;

    vec3 green = vec3(0.0, 1.0, 0.0);
    vec3 blue = vec3(0.0, 0.0, 1.0);

    // vec3 col = mix(green, blue, 0.5);
    vec3 col = mix(green, blue, x);
    gl_FragColor = vec4(col, 1.0);
}