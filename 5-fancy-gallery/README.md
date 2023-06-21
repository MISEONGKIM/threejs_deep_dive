# 마크업과 threejs

## 카메라의 위치와 시야각을 html의 사이즈에 맞추기

### 맞춰야하는 이유

- 아래 코드처럼 width, height를 주면 화면에 mesh가 꽉 찬다.

* html에서 표현되는 사이즈와 canvas 단위가 다르다.
  - 만약에 html에서 width, height값은 1값을 주면 1px로 적용이 됨.
  - canvas는 카메라 개념이 들어가서 width와 height를 동일하게 주더라도, 카메라의 위치가 canvas의 mesh에 가깝다면 mesh가 더 크게 보이고 ,카메라의 위치가 canvas의 mesh와 거리가 멀어진다면, 사이즈가 동일할 지라도 mesh는 작게 보임

```
const { width, height, top, left } = image.getBoundingClientRect();
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  size: THREE.DoubleSide
});
const geometry = new THREE.PlaneGeometry(width, height, 16, 16);
const mesh = new THREE.Mesh(geometry, material);
```

### 시야각 계산

설명 : https://www.notion.so/html-71ea1d44b6e643219c98e62c611842a5

```
  camera.fov = Math.atan(canvasSize.height / 2 / 50) * (180 / Math.PI) * 2;
```

## threejs 좌표체계 html의 좌표체계로 맞추기

- threejs 좌표체계와 html의 좌표체계가 다름. 만약 (0, 0)이 있다면 threejs에선 정중앙에 위치하고, html에선 좌측상단에 위치함
- html의 좌표계의 위치에 맞게 좌측상단에 mesh가 위치하도록 아래처럼 조정한다.
- **Threejs에서 y좌표 +(플러스)하면 위로, (-)하면 아래로, x좌표 +하면 오른쪽, -이면 왼쪽으로 감**

```
  //html의 (0, 0) 위치로
    mesh.position.y = canvasSize.height / 2 - height / 2;
    mesh.position.x = -canvasSize.width / 2 + width / 2;
```

- top -(마이너스)를 하여 좌측상단에서 top의 크기만큼 아래로 이동
- left +(마이너스)하여 좌측상단에서 left의 크기만큼 오른쪽으로 이동

```
  mesh.position.y = canvasSize.height / 2 - height / 2 - top;
  mesh.position.x = -canvasSize.width / 2 + width / 2 + left;
```

## 노이즈

여러 glsl noise함수 정리해둔 곳 : https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

- 포스트 프로세싱 필름패스 처럼 자글자글한 효과가 노이즈

* 노이즈 함수는 랜덤 함수와는 분명한 차이가 있다. 랜덤 함수는 아무 연관성없는 무작위의 난수 생성, 노이즈는 연관성이 있는 숫자값 생성 보다 더 유기적이고 일관된 구조를 가진 질감을 만들고 싶을 때 노이즈 사용함
