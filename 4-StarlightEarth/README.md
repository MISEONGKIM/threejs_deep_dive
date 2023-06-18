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

- gl_PointCoord
  - 포인트 조각 내의 좌표를 의미, 글로벌한 좌표가 아닌 사각형으로 된 개별 포인트 내의 좌표, 0 ~ 1사이의 값
