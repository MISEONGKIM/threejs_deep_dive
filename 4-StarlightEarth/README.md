# 별빛 지구 만들기

- ShaderMaterial을 사용하는 순간 MeshBasicMaterial, MeshStandardMaterial에서 사용하는 map, opacity, alphaMap 같은 속성은 더 이상 사용 못함.

  - 아래처럼 map 속성으로 texture을 매핑해줘도 텍스처가 보이지 않음.

    ```
        const material = new THREE.ShaderMaterial({
            map: textureLoader.load("assets/earth-specular-map.png"),
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
        });
    ```

  - 직접 fragmentShader에서 해줘야함.

    - fragment.glsl에서 텍스처를 가져올 땐 항상 sampler2D 자료형으로 가져와야 함

    ```
        // app.js
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: {
                 value: textureLoader.load("assets/earth-specular-map.png"),
                },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
        });

        //fragment.glsl
        uniform sampler2D uTexture;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }
    ```

* fragmentShaders에서 투명도를 조절했을 때 ShaderMaterial의 transparent: true을 주어야 효과가 적용됨.

```
     const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {
          value: textureLoader.load("assets/earth-specular-map.png"),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });
```

- IcosahedronGeometry 사용 시 유의점
  - 해당 프로젝트에서 earth는 SphereGeometry로, earthPoints는 IcosahedronGeometry로 각각 생성하니 텍스처의 위치가 좀 다름. 계산방식이 다른 거 같다고 함
  - **IcosahedronGeometry로 생성할 땐 texture 위치가 다를 수 있다는 점을 기억**
  * SphereGeometry과 IcosahedronGeometry를 wireframe으로 세그먼츠의 모양을 모면 다름, 이런걸 고려하면서 어떤 geometry로 할지 결정하는 게 좋다

```
    const geometry = new THREE.IcosahedronGeometry(0.9, 40, 40);
    // 위치 조정
    geometry.rotateY(-Math.PI);
```

## Points 객체의 ShaderMaterial

- Mesh가 아닌 **Ponints 객체의 ShaderMaterial를 사용하게 되면 하나의 mesh 단위가 아니라 각각의 포인트 단위로 색이 적용됨. 즉 각각의 포인트가 fagmentShader가 적용되는 캔버스임.**

* gl_PointSize
  - vertexShader에서 포인트의 크기 조정

- gl_PointCoord
  - fagmentShader에서 사용, 포인트 조각 내의 좌표를 의미, 글로벌한 좌표가 아닌 사각형으로 된 개별 포인트 내의 좌표, 0 ~ 1사이의 값

## 도트 만들기

### Mesh 이용

```
  //texture2D로 텍스처를 모델에 매핑하면, 바다는 1, 육지는 0 값으로 가져와짐. 왜냐면 텍스처 이미지가 바다가 하얀색으로 되어있다. 바다를 검은색으로 하기 위해 1.0 - map.rgb로 색상 반전 시키기
  // vec3(1.0) - map.rgb랑 같은 수식임
    vec4 map = texture2D(uTexture, vUv);
    vec3 col = 1.0 - map.rgb;

  // col.r이던 col.g, col.b 다똑같은 값인 아무거나 사용해도 됨.
    float alpha = col.r;

  // fract로 소수점만 구함. x, y축으로 각각 100줄 생성됨.(한 줄에 검 => 흰 그라데이션)
    float x = fract(vUv.x *  100.0);
    float y = fract(vUv.y *  100.0);

// vec2(x,y)로 위에서 구한 x,y합하면 격자 모양 생성됨
// 각각 격자모양의 좌표값 거리 계산 : length를 이용해 0.5(중간값)랑 가까울수록 0값이 됨.(즉, 중앙에 가까울 수록)
    float dist = length(vec2(x, y) - 0.5);

    vec3 greenColor = vec3(0.0, 1.0, 0.0);

  // step으로 위에서 구한 거리가 0.1보다 작으면 0이니까 초록색, 0.1보다 크면 검은색 => 즉 중앙에 초록 동그라미가 생김
    vec3 finalColor = mix(greenColor, vec3(0.0), step(0.1, dist));

  //위에 코드까지 실행해서 생성된 도트로 이루어진 구에 가져온 텍스처 모양대로 보이게 하기 위해 map.r 더해준다.
  // map.r은 육지 검은색(0), 바다 흰색(1) 값임. 그래서 이까지하면 바다가 초록색으로 보이고, 육지는 도트 모양, 육지 테두리 초록색
  // 2.0 : 좀더 잘 보이게하기위해 더해주는 값
    finalColor.g += map.r * 2.0;

// alpha : 바다 부분 0
// finalColor.g : 육지부분 도트/바다(1), 육지부분 도트아닌부분(0)
// finalColor.g * alpha 이렇게 곱하면 바다부분이 0으로 됨, 이를 투명도 속성에 추가하여 0인 부분은 투명하게 처리
    gl_FragColor = vec4(finalColor, finalColor.g * alpha);
```

### Points 이용

1. float strength = 1.0 - step(0.3, fromCenter)

   - 이렇게 하면 도트의 가장자리가 덜 부드러움. step은 0.3기준으로 컷팅을 해버리기 때문에 덜 부드럽게 나오는 듯 ?

2. float strength = r / fromCenter - (r \* 2.0)
   - 위의 방법보다 도트의 가장자리가 부드러움
   - fromCenter의 값이 커질 수록 strength의 값이 작아지기 때문에 0에 수렴해서 투명해짐.
   - r은 반지름으로 아래 소스에선 0.01을 넘겨주었음
     - (r \* 2.0)를 한 이유 : 0.01 / 0.5(fromCenter의 최대값) = 0.02 이다. 즉, 해당 수식에서 strength의 최소값 0.02 => strength를 0으로 만들기 위해 0.02(= r \* 2.0)를 빼줌.

```
float circle(vec2 coord, float r) {
    float fromCenter = length(coord - 0.5);

    // float strength = 1.0 - step(0.3, fromCenter);

    float strength = r / fromCenter - (r * 2.0) ;

    return strength;
}
void main()
{
    float strength = circle(gl_PointCoord, 0.01);
    vec4 map = texture2D(uTexture, vUv);
    vec3 col = 1.0 - map.rgb;
    // 바다부분 투명하게 처리하기 위해 col.r 곱함
    float alpha = col.r * strength;



    vec3 greenColor = vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(greenColor, alpha);
}
```

## glow 효과 만들기

### normal

- 물체의 면이 향하는 방향
- glsl에서는 각 정점마다 normal값을 저장하기 때문에 면 위에 있는 정점이 향하고 있는 방향에 대해서 그 정도값을 다루는 개념

* VertexNormalsHelper : threejs에서 normal을 표시해주는 helper
  - 파라미터
    1. normal 방향을 확인하고 싶은 mesh
    2. helper라인의 길이 값
* mesh 객체의 wireframe: true설정하면 mesh의 정점들이 보이므로, 각 정점마다 helper라인이 수직으로 뻗어나가는 것을 확인할 수 있다.

```
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";

  const createEarthGlow = () => {
    const material = new THREE.ShaderMaterial({
      wireframe: true,
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    });

    const geometry = new THREE.SphereGeometry(1, 40, 40);

    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  };


  const earthGlow = createEarthGlow();
  const glowNormalHelper = new VertexNormalsHelper(earthGlow, 0.2);
  scene.add(earthGlow, glowNormalHelper);
```

- helper라인 수직선의 방향에 따라 해당 정점이 어느 쪽을 바라보고 있는 지 정보를 알 수 있는 것. 그렇기 때문에 특정 좌표에서 해당 mesh로 빛을 쏴서 빛의 백터정보와 mesh의 normal값을 비교해 해당 정점에 속한 면을 더 밝게 렌더링 해야하는 지, 더 어둡게 렌더링 해야하는 지를 결정할 수 있음. 이렇게 비교해서 값을 얻는 과정을 내적이라고 함. 정확히는 두 백터의 방향이 얼마나 일치하는 지를 알기 위해 사용하는 게 내적이란 함수인 데, 용도가 그렇다 보니 빛이 물체에 비치는 정도를 구할 때도 쓰일 수 있음. 이 과정을 셰이더에서 간단하게 구할 수 있다.
- 내적은 같은 방향을 가르키면 양수 반대방향을 가르키면 음수
- dot()함수가 내적을 구하는 기능을 해줌.

```
varying vec3 vNormal;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

// 1보다 크지않게 정규화 : normalize(), normalMatrix
  vNormal = normalize(normalMatrix * normal);

}
```

```
  varying vec3 vNormal;

  void main() {
    //광원의 위치정보(x좌표, y좌표, z좌표), 만약 x좌표에 3.0주면 오른쪽에 있다고 가정(x좌표에 -3.0하면 왼쪽에 있다고 가정)
  vec3 lightSource= vec3(0.0, 0.0, -3.0);
  float intensity = dot(vNormal, lightSource);

    vec3 greenCol = vec3(0.246, 0.623, 0.557);

  // 기존 색상에 빛의 강도를 적용해서 광원과 가까운 부분은 높은 내적 +1에 가까움(밝다), 멀리있는 부분은 낮은 내적 -1에 가까움(어둡다)
    gl_FragColor = vec4(greenCol, 1.0) * intensity;
  }
```
