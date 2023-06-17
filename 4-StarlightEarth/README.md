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
