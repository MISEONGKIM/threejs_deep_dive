varying vec2 vUv;
varying float vDistance;

void main()
{
    vec4 mvPosition = viewMatrix*  modelMatrix * vec4(position, 1.0) ;
    gl_Position = projectionMatrix *  mvPosition;
    
    //정점의 거리값 계산 
     // 카메라에서 부터 정점사이의 거리가 멀어질수록 지구 뒷쪽은 초록색, 가까워질수록 지구 앞쪽은 포인트만 보이게
     //뷰 공간에서 정점의 거리값을 구함.
    float dist = pow(length(mvPosition.xyz) /2.0, 6.0);
    
    vUv = uv;
    vDistance = dist;
}