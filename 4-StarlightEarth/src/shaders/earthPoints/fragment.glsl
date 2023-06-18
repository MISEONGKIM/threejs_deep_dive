uniform sampler2D uTexture;
varying vec2 vUv;

void main()
{
    //gl_PointCoord : 포인트 조각 내의 좌표
    float fromCenter = length(gl_PointCoord.xy - 0.5);
    float strength = step(0.3, fromCenter);

    vec4 map = texture2D(uTexture, vUv);
    // 색상 반전 시키기 위해 1.0 - map.rgb 함
    //1.0 - map.rgb => vec3(1.0) - map.rgb랑 같은 의미 
    vec3 col = 1.0 - map.rgb;
    float alpha = col.r * fromCenter;

    float x = fract(vUv.x *  100.0);
    float y = fract(vUv.y *  100.0);

    //원모양만듬
    float dist = length(vec2(x, y) - 0.5);
    
    vec3 greenColor = vec3(0.0, 1.0, 0.0);
    vec3 finalColor = mix(greenColor, vec3(0.0), step(0.1, dist));
    finalColor.g += map.r * 2.0;
    gl_FragColor = vec4(greenColor, alpha);
}