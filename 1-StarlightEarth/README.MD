## 지구 만들기

- BufferGeometry()의 position 설정 시 유의점

* Float32Array() : threejs는 일반배열을 넘겨주면 제대로 된 데이터 파악을 못함. 보다 정확한 데이터 자료형을 넘겨줘야함

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
