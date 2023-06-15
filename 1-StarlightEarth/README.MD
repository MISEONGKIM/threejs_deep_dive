# 지구 만들기 basic

- BufferGeometry()의 position 설정 시 유의점

  - Float32Array() : threejs는 일반배열을 넘겨주면 제대로 된 데이터 파악을 못함. 보다 정확한 데이터 자료형을 넘겨줘야함

```
 createStar({ materialOpt, geometryOpt }) {

    const positions = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      positions[i] = Math.random() * 3;
      positions[i + 1] = Math.random() * 3;
      positions[i + 2] = Math.random() * 3;
    }
    const particleGemoetry = new THREE.BufferGeometry();
    particleGemoetry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }
```

- ThreeJS에선 png의 투명한 부분을 검은색으로 처리하기 때문에 투명한 부분은 투명하게 처리하겠다라는 정보를 전달해줘야함.
  - alphaMap 속성으로 texture 정보 전달

```
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      depthWrite: false,
      alphaMap: this.textureLoader.load("assets/particle.png"),
    });

```

## 한국, 가나 사이의 커브 생성 과정에서 알게된 것들

- THREE.Vector3().lerpVectors(v1: THREE.Vector3, v2: THREE.Vector3, alpha: number) : 두 백터 사이에 어떤 숫자가 있을 것인지 추정해서 반환해주는 함수

  - 즉, 두 좌표사이에 i번째 해당하는 정점을 구해주는 함수

- pos.normalize() : 단위를 1미만으로 정규화

  - 구의 반지름의 크기만큼 쉽게 곱해서 사용하기 위해서 사용하기 위해 사용했음

- multiplyScalar() : 커브의 스케일 키워주는 함수
  1. 1.3 : 지구 mesh의 반지름 크기가 1.3이라서 1.3설정 => 이까지하면 지구 둘레에 딱맞게 커브 커짐.
  2. wave : 좀더 커브를 위로 휘도록 만들기 위해 i번째일 때 높이 값
  3. 0.4 : 위에서 구한 높이값(wave)에 값을 더 추가하여 더 휘게 만들기 위한 사이즈 값

```
   const points = [];
   ...

  for (let i = 0; i <= 100; i++) {

      const pos = new THREE.Vector3().lerpVectors(
        startPosition,
        endPosition,
        i / 100
      );
      pos.normalize();

      const wave = Math.sin((Math.PI * i) / 100);

      pos.multiplyScalar(1.3 + 0.4 * wave);

      points.push(pos);
    }

     const curve = new THREE.CatmullRomCurve3(points);
```

- threejs에선 gradient 없음 그래서 canvas로 만들고 THREE.CanvasTexture()로 texture 생성해서 Material에 옵션 줌

```
 const graidentCanvas = this.getGradientCanvas("#757F94", "#263D74");
    const texture = new THREE.CanvasTexture(graidentCanvas);

    const metarial = new THREE.MeshBasicMaterial({
      map: texture,
    });

//gradient 생성
  getGradientCanvas(startColor, endColor) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 256;
    canvas.height = 1;

    const gradient = context.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);

    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 1);

    return canvas;
  }
```

## 포스트 프로세싱(후처리)

Pass는 포스트 프로세싱에서 효과와 같은 의미라고 생각하면 됨.
Renderer는 카메라를 통해 Scene의 snapshot을 찍는데, 이를 Render Target이라고 한다.
이때 이를 canvas에 그리기 전에 우리는 filter를 통해 몇 가지 작업을 추가할 수 있는데 이게 포스트 프로세싱임.

### 기본설정

- EffectComposer : 효과를 관리하는 매니저

* RenderPass : 현재 어떤 scene과 camera를 사용하는 지 넘겨주기 위해 사용
* effectComposer.render()
  - renderer.render(scene, camera) 렌더기능 위임
  * render의 encoding 정보(renderer.outputEncoding = THREE.sRGBEncoding)를 따로 설정해주었다면 Render Target을 도중에 가로채기 때문에 지정한 encoding으로 렌더링 되지 않을 수 있음
    - GammaCorrectionShader로 해결, 이는 밝게 ? 빛 효과 줌. pass효과 주고나서 어디에 놓을 지는 개발자의 판단
    ```
       const shaderPass = new ShaderPass(GammaCorrectionShader);
    ```

```
effectComposer.setSize(canvasSize.width, canvasSize.height);

const renderPass = new RenderPass(scene, camera);

effectComposer.addPass(renderPass);

effectComposer.render();
```

### 앤티앨리어싱 적용

개체의 가장자리가 각져보이는(계단처럼) 현상을 매끄럽게 처리

```
  const renderTarget = new THREE.WebGLRenderTarget(
    canvasSize.width,
    canvasSize.height,
    {
      samples: 2,
    }
  );
  const effectComposer = new EffectComposer(renderer, renderTarget);
```

### Pass 종류

- FilmPass : 영화 필름의 노이즈한 느낌
- GlitchPass : 컴퓨터 고장났을 때 화면 지지직 거리는 느낌
- AfterimagePass : 잔상 효과

* HalftonePass: 텍스처의 질감을 미술관에 있는 그림같은 느낌
* UnrealBloomPass : 빛의 노출 값을 조절해서 물체의 밝기를 원하는대로 조절해 줄 수 있는 효과
  - strength :빛의 밝기
  - threshold : 사물의 빛나는 영역(임계값)
  * radius :빛의 번지는 정도
* **OutlinePass : 실무에서 많이 사용. 물체의 외곽선을 그려주는 효과**
  - 보통 사용자가 마우스를 클릭한 물체가 무엇인 지 알려줄 때 사용하는 편
  * OutlinePass 적용 시 또 앨리어싱 문제 발생,
  * SMAAPass : 앤티앨리어싱 적용

## 커스텀 셰이더(포스트 프로세싱을 이용하여 씬 전체에 셰이더 적용)

### vertexShader, fragmentShader

- ShaderPass로 셰이더를 넘겨준다. 셰이더 생성 시 vertexShader, fragmentShader 필요
- vertexShader : 영역생성
- fragmentShader를 : 픽셀마다 색 입힘
- 둘다 glsl란 언어로 작성해 줌

* 아래처럼 생성하면 vPosition에 의해 초록(좌측상단), 노랑(우측상단), 빨강(우측하단), 검정(좌측하단)생성 됨.
  - 검정 : 좌측 하단은 x도 음수 ,y도 음수라서 0보다 작아서 검은색이 됨.

```
   customPass = () => {
    /**
     * position 변수(정점 데이터)는 내장되어있어서 사용할 수 있음
     *
     */
    const customShaderPass = new ShaderPass({
      vertexShader: `
       varying vec2 vPosition;
       void main() {
        gl_Position  = vec4(position.x, position.y, 0.0, 1.0);
        vPosition = position.xy; //이렇게 하면 vec2가 됨
       }
      `,
      fragmentShader: `
      varying vec2 vPosition; //-1 ~ 1 사이의 위치값 의미
       void main() {
        gl_FragColor = vec4(vPosition, 0.0, 1.0);
       }
      `
    });

    this.effectComposer.addPass(customShaderPass);
  };
```

- rgb는 0 ~ 1 사이의 값을 가져야 함으로 정규화하는 과정 필요함 uv를 이용해서 해당 문제 해결
  - uv : 2d 텍스처를 3d 텍스처로 매핑할 때 사용되는 좌표 개념

```
const customShaderPass = new ShaderPass({
      vertexShader: `
       varying vec2 vPosition;
       varying vec2 vUv;

       void main() {
        gl_Position  = vec4(position.x, position.y, 0.0, 1.0);
        vPosition = position.xy;
        vUv = uv;
       }
      `,
      fragmentShader: `
      varying vec2 vPosition;
      varying vec2 vUv;

       void main() {
        gl_FragColor = vec4(vUv, 0.0, 1.0);
       }
      `
    });
```

### uniforms

- vertexShader => fragmentShader 넘길 때 사용하는 varying과 달리 uniforms는 양쪽에 데이터를 전달할 때 사용

* 반드시 value에 값 입력

```
const customShaderPass = new ShaderPass({
      uniforms: {
        uColor: { value: new THREE.Vector3(0, 0, 1) },
        uAlpha: { value: 0.5 }
      },
      vertexShader: `
       varying vec2 vPosition;
       varying vec2 vUv;

       void main() {
        gl_Position  = vec4(position.x, position.y, 0.0, 1.0);
        vPosition = position.xy;
        vUv = uv;
       }
      `,
      fragmentShader: `
      uniform vec3 uColor;
      uniform float uAlpha;
      varying vec2 vPosition;
      varying vec3 vUv;

       void main() {
        gl_FragColor = vec4(uColor, uAlpha);
       }
      `
    });
```

### 셰이더에 지구,별,커브와 같은 생성한 오브젝트 매핑

- tDiffuse: 포스트 프로세싱에서 이미 정의되어있는 변수 이름
  - 포스트 프로세싱 파이프라인에 따라 렌더링하던 지구와 별, 커브를 포함한 모든 물체가 하나의 텍스처 이미지로서 tDiffuse에 저장됨
  - 이 데이터를 fragmentShader로 넘겨 픽셀의 색상값을 사용할 수 있도록 하는 것
  * sampler2D 자료형으로 가져옴.
  * vec4 tex = texture2D(tDiffuse, vUv) : tDiffuse값을 uv좌표(텍스처를 모델에 매핑할 때 사용)에 매핑

* gl_Position = vec4(position.x, position.y, 0.0, 1.0) => vec4()의 3번째 인자(z값)가 0인데 3D로 렌더링 되는 이유 : 포스트 프로세싱은 어디까지나 3D로 렌더링된 최종 이미지를 2D의 형태로 가공하기 때문에
  - 즉, 3D처럼 보이는 이미 완성된 도화지 그림에 효과를 입히는 것 뿐이기 때문

```
    const customShaderPass = new ShaderPass({
      uniforms: {
        uColor: { value: new THREE.Vector3(0, 0, 1) },
        uAlpha: { value: 0.5 },
        tDiffuse: { value: null } // null로 초기화
      },
      vertexShader: `
       varying vec2 vUv;

       void main() {
        gl_Position  = vec4(position.x, position.y, 0.0, 1.0);
        vUv = uv;
       }
      `,
      fragmentShader: `
      uniform sampler2D tDiffuse;

      varying vec2 vUv;

       void main() {
        vec4 tex = texture2D(tDiffuse, vUv);
        gl_FragColor = tex; //반영
       }
      `
    });
```

### 셰이더로 지구의 위치 변경

- tDiffuse 값이 uv에 매핑되어 있으므로 uv의 좌표를 바꿔주면 매핑되는 텍스처의 좌표에도 변화가 생김.

* vec2 newUV = vec2(vUv.x + 0.2, vUv.y)
  - 새로운 uv생성해서 좌표 수정
  - 지구가 왼쪽으로 0.2만큼 이동, UV의 값이 0 ~ 1 사이에서 0.2 ~ 1.2사이로 바꼈기 때문
  - 이에 따라 텍스처를 매핑하는 과정에서 0부터 0.2사이만큼 밀린 거
  - 원래있던 텍스처에 (0,0) 에서부터 샘플링 되던 게 (0.2, 0) 에서부터 샘플링이 되면서 1을 초과하는 1에서 1.1사이의 텍스처는 외곡되는 것 처럼 보임
  - 이렇게 UV값을 변형을 주는 건 디스토션이라는 외곡효과를 줄 때 자주 사용하는 기법 중에 하나

```
    const customShaderPass = new ShaderPass({
      uniforms: {
        uBrightness: { value: 1 },
        uPosition: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Vector3(0, 0, 1) },
        uAlpha: { value: 0.5 },
        tDiffuse: { value: null }
      },
      vertexShader: `
       varying vec2 vUv;

       void main() {
        gl_Position  = vec4(position.x, position.y, 0.0, 1.0);
        vUv = uv;
       }
      `,
      fragmentShader: `
      uniform float uBrightness;
      uniform vec2 uPosition;
      uniform vec3 uColor;
      uniform sampler2D tDiffuse;

      varying vec2 vUv;

       void main() {

        // vec2 newUV = vec2(vUv.x + 0.2, vUv.y);

        vec2 newUV = vec2(vUv.x, vUv.y);

        vec4 tex = texture2D(tDiffuse, newUV);
        tex.rgb += uColor;

        //더 빛나게
        // brightness 값이 더 작아질 수록 tex의 값은 더 높아질 거고 높아진 만큼 더 하얗게, 즉 더 밝아짐
        // float brightness = 0.1;

        float brightness = sin(uBrightness + vUv.x);


        gl_FragColor = tex / brightness;
       }
      ` //픽셀마다 색 입힘
    });
```

## ETC

- geometry.setDrawRange() : 영역을 어디까지 그릴 건지 정하는 함수
