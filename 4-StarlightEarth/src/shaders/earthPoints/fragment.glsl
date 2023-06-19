uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;
varying float vDistance;

float circle(vec2 coord, float r) {
        //gl_PointCoord : 포인트 조각 내의 좌표
    float fromCenter = length(coord - 0.5);

    /* 아래처럼 할 수도 있지만, 도트의 가장자리가 덜 부드러움.
     step은 0.3기준으로 컷팅을 해버리기 때문에 덜 부드럽게 나오는 듯 ?  
    */
    // float strength = 1.0 - step(0.3, fromCenter);

    /*
     아래처럼 하면 도트의 가장자리가 부드러워짐.
     fromCenter의 값이 커질 수록 strength의 값이 작아지기 때문에 0에 수렴해서 투명해짐.
     r = 0.01,
     0.01 / 0.5(fromCenter의 최대값) = 0.02 : strength의 최소값
     strength를 0으로 만들기 위해 0.02(=r * 2.0)를 빼줌.
    */
    float strength = r / fromCenter - (r * 2.0) ;

    return strength;
}

float random(vec2 uv) {
    //이 공식은 별 의미 없음 랜덤값 생성
    return fract(dot(uv, vec2(12.9898, 78.233))) * 43758.5453;
}

void main()
{
    vec4 map = texture2D(uTexture, vUv);
    vec3 col = 1.0 - map.rgb;

    float strength = circle(gl_PointCoord, 0.03);
    //육지의 검은 포인트 부분 투명하게 하기위해 
    // vDistance : 거리에따라 포인트 어둡게 하기위해
    float alpha = col.r * strength * vDistance;

    //반짝 반짝 효과를 주기위해 
    //uTime이 너무빨라 너무빨리반짝거려서  400.0라는 임의값으로 나눠서 느리게 반짝거리게함
    float randomNumber = random(vUv + uTime / 400.0);

    
    vec3 greenColor = vec3(0.08, 0.356, 0.196);
    vec3 deepGreenColor = vec3(0.036, 0.123, 0.057);
    vec3 finalCol = mix( greenColor, deepGreenColor, randomNumber);

    gl_FragColor = vec4(finalCol, alpha);
}