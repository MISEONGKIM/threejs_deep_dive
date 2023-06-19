uniform sampler2D uTexture;
varying vec2 vUv;
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
void main()
{
    float strength = circle(gl_PointCoord, 0.01);
    vec4 map = texture2D(uTexture, vUv);
    vec3 col = 1.0 - map.rgb;
    //육지의 검은 포인트 부분 투명하게 하기위해 
    float alpha = col.r * strength;


    
    vec3 greenColor = vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(greenColor, alpha);
}