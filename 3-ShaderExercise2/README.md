# 셰이더 연습2

## glsl 내장 함수

더 많은 함수를 알아보고 싶다면 => https://thebookofshaders.com/

- step() : 텍스처 이미지의 일부분을 잘라주고 싶을 때 사용함
  - 아래 코드는 x가 0.5보다 작으면 0, 크면 1
  - discard : step가 0일 때 검은색 부분은 렌더링 하지 않겠다. 즉 step의 반환 값이 0이면 버리겠다.

```
    float x = vUv.x;
    float y = vUv.y;

   // x가 0.5보다 작으면 0, 크면 1
    float strength = step(0.5, x);

    if (strength === 0.0) {
        discard;
    }

    vec3 col = vec3(strength);

    gl_FragColor = vec4(col, 1.0);
```

- min ()
  - x가 0.5보다 작으면 x, 크면 최소값인 0.5 반환
    - 0.5보다 작을땐 : x좌표값에 따른 그라데이션(검은색에서 회색)
    * 0.5보다 클땐 : 회색만

```
    float x = vUv.x;
    float y = vUv.y;

    float strength = min(0.5, x);

    vec3 col = vec3(strength);

    gl_FragColor = vec4(col, 1.0);
```

- max()
  - x가 0.5보다 크면 x, 작으면 최소값인 0.5 반환
    - 0.5보다 클땐 : x좌표값에 따른 그라데이션(회색에서 흰색)
    * 0.5보다 작을 땐 : 회색만

```
    float x = vUv.x;
    float y = vUv.y;

    float strength = max(0.5, x);

    vec3 col = vec3(strength);

    gl_FragColor = vec4(col, 1.0);
```

- clamp()

  - min, max 같이 사용하는 함수
  - 파라미터 3가지
    - 기준값
    - 하한선 : 이 값보다 작은 경우 해당 값 반환
    - 상한선 : 이 값보다 커지는 경우 해당 값 반환

```
  float x = vUv.x;
  float y = vUv.y;

  float strength = clamp(x, 0.0, 1.0);

  vec3 col = vec3(strength);

  gl_FragColor = vec4(col, 1.0);
```

- smoothstep()
  - 직접 구현한 smoothy함수
    - 좀 더 부드럽게 컷팅될 수 있도록, 아래 코드에서 clamp로 만든 그라데이션을 좀 더 부드럽게 적용
    - 셰이더 코딩에서 많이 사용되는 공식 중 하나 => y = ( x \* x) \* (3 - 2x) : x가 1일때 y도 1
  * smoothstep() : 직접 구현한 smoothy()함수와 같은 기능을 하는 smoothstep()이란 이미 내장된 함수가 있음
    - float smoothstep(float edge0, float edge1, float x)
    - x가 edge0보다 작을 경우 0을 반환
    - x가 edge1보다 크거나 같을 경우 1을 반환
    - x가 edge0과 edge1 사이에 위치할 경우, x를 [edge0, edge1] 범위로 정규화한 값을 t라고 합시다. (즉, t = (x - edge0) / (edge1 - edge0))
      - t를 이용하여 보간된 결과값을 계산. 계산식: t \* t \* (3.0 - 2.0 \* t)

```
float smoothy(float edge0, float edge1, float x) {
    // 0.3에서 0.7까지 그라데이션 만들기
    //x가 0.3이면 0, 0.7이면 1로 만들어주기
    float t = clamp((x - 0.3) / (0.7- 0.3),0.0,1.0);


    float strength = t * t * (3.0 - 2.0 * t);

    return strength;
}

void main() {
    ...

    // float strength = smoothy(0.3, 0.7, x);
    float strength = smoothstep(0.3, 0.7, x);
    vec3 col = vec3(strength);
    ...

}
```

- mix()
  - 두 기능을 받아 적절히 섞어주는 함수
  * 세번째로 넘겨준 인자값에 따라 첫번째, 두번째로 넘겨준 값을 적절히 배합
    - mix(1.0, 2.0, 0.0) : 0.0
    - mix(1.0, 2.0, 0.25) : 1.25
    - mix(1.0, 2.0, 0.5) : 1.5

```
    float x = vUv.x;
    float y = vUv.y;

    vec3 green = vec3(0.0, 1.0, 0.0);
    vec3 blue = vec3(0.0, 0.0, 1.0);

   // 초록과 파랑을 섞은 값
   // vec3 col = mix(green, blue, 0.5);

   // 초록 -> 파랑으로 그라데이션처럼 섞임
    vec3 col = mix(green, blue, x);

    gl_FragColor = vec4(col, 1.0);
```

- fract()
  - 숫자의 소숫점만 반환해주는 함수

```
  float x = vUv.x ;
  float y = vUv.y;

   vec3 col = vec3(fract(x * 7.0));
   col = step(0.5, col);


    gl_FragColor = vec4( col, 1.0);
```

- distance()
  - 거리의 크기
  * 양수값
  * 아래 코드는 x 값이 0.5에 가까울수록 거리값은 0이 되서 중간이 검은색이 됨. (회색 => 검은색 => 회색 그라데이션)
    - 회색인 이유 : x의 최소가 0인 데 0.5랑 거리값은 0.5이고, 최대가 1인데 이때도 거리값은 0.5이므로

```
    float x = vUv.x;
    float y = vUv.y;

    float dist = distance(x, 0.5);

    vec3 col = vec3(dist);
    gl_FragColor = vec4(col, 1.0);
```
