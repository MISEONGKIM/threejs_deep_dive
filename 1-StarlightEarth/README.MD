## 지구 만들기

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

- FilmPass : 영화 필름같은 느낌
- GlitchPass : 컴퓨터 화면 오류났을 때 지지직 거리는 느낌
- AfterimagePass : 잔상 효과
