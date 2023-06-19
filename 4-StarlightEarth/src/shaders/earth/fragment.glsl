uniform sampler2D uTexture;
varying vec2 vUv;

void main()
{
    vec4 map = texture2D(uTexture, vUv);
    // 색상 반전 시키기 위해 1.0 - map.rgb 함
    //1.0 - map.rgb => vec3(1.0) - map.rgb랑 같은 의미 
    vec3 col = 1.0 - map.rgb;
    float alpha = col.r;

/*    도트 느낌 만들기  => 첨엔 이렇게 했다가 earthPoints 사용해서 만들어 줌.  이러한 방법도 있다는 것도 알아두기 
    float x = fract(vUv.x *  100.0);
    float y = fract(vUv.y *  100.0);

    float dist = length(vec2(x, y) - 0.5);
    
    vec3 greenColor = vec3(0.0, 1.0, 0.0);
    vec3 finalColor = mix(greenColor, vec3(0.0), step(0.1, dist));
    

  //위에 코드까지 실행해서 생성된 도트로 이루어진 구에 가져온 텍스처 모양대로 보이게 하기 위해 map.r 더해준다.
  // map.r은 육지 검은색(0), 바다 흰색(1) 값임. 그래서 이까지하면 바다가 초록색으로 보이고, 육지는 도트 모양, 육지 테두리 초록색
  // 2.0 : 좀더 잘 보이게하기위해 더해주는 값
    finalColor.g += map.r * 2.0;

    */
    vec3 greenColor = vec3(0.0, 1.0, 0.0);
    //2.0 : 좀더 잘 보이게하기위해 더해주는 값
    vec3 finalColor =  map.r * greenColor * 2.0;

// alpha : 바다 부분 0
// finalColor.g : 육지부분 도트/바다(1), 육지부분 도트아닌부분(0)
// finalColor.g * alpha 이렇게 곱하면 바다부분이 0으로 됨, 이를 투명도 속성에 추가하여 0인 부분은 투명하게 처리
    gl_FragColor = vec4(finalColor, finalColor.g * alpha );
}