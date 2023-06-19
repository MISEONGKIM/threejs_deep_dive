varying vec2 vUv;
varying float vDistance;

void main()
{
    vec4 mvPosition =  viewMatrix * modelMatrix * vec4(position, 1.0) ;
    float hiddenss = 0.45;
    //분모가 작을 수록 dist값은 커짐, 분모가 작다는 건 거리값이 작다는 것. 
    float dist = (1.0 / length(mvPosition.xyz)) - hiddenss;

    gl_PointSize = 10.0;
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;
    vDistance = dist;
}