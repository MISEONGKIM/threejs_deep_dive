uniform sampler2D uTexture;
varying vec2 vUv;
varying float vDistance;

void main()
{
    vec4 map = texture2D(uTexture, vUv);
    vec3 col = 1.0 - map.rgb;
    float alpha = col.r;

    vec3 greenColor = vec3(0.08, 0.356, 0.196);

    //카메라에 가까울 수록 육지를 채우는 색은 흐리고, 육지경계선만 남고
    // 멀수록 에메랄드 빛의 육지가 보이도록 
    // 2.0은 색을 더 진하게 하기위해
    float strength  = mix(map.rgb * 5.0, greenColor, vDistance).g * 2.0;

    vec3 finalColor =  greenColor * strength;


    gl_FragColor = vec4(finalColor, finalColor.g * alpha );
}