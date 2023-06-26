# 3D 물리 공간 구축

## cannon-es

- 가볍고 쉽게 3D 물리엔진을 사용할 수 있는 라이브러리

* World : cannonjs에서 가장 중요한 객체, 물리 시뮬레이션을 실행하는 데 필요한 다양한 기능 제공.
  - 물리 시뮬레이션의 초기화나 물체 생성 초기화하는 기능, 충돌 검사하고 중력을 설정하는 기능 등을 수행
* broadphase : world 객체에서 두 물체간의 충돌을 감지하고 제어할 수 있는 데 도움을 주는 알고리즘, 물리엔진에서 충돌을 검출하기 위한 단계임.
  - SAPBroadphase : 가장 보편적으로 사용되는 충돌을 감지하는 알고리즘
  * 충돌가능성이 있는 물체의 쌍을 추려내는 건 굉장히 중요함. 이를 통해 불필요한 계산을 줄이고 성능을 향상시킬 수 있음.
* world.gravity : 중력 설정, 질량이 더 큰 물체 일수록 중력이 더 크게 작용
* world.allowSleep : true로 주면 움직이지 않는 물체를 물리 시뮬레이션에서 계산할 수 있는 절차를 건너 뛸 수 있음.
  - 즉, 정지된 물체는 sleep 상태로 전환되어서 더 이상 충돌 검사나 이동과 같은 계산에 포함 안됨.
  - 성능 높이기 위해 사용됨.

```
  const world = new CANNON.World();
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.gravity.set(0, -9.82, 0);
  world.allowSleep = true;
```

### 물리공간에 물체 추가

- Material() : ThreeJS의 material과는 다르게 해당 물체의 마찰력과 탄성의 정도를 설정할 수 있게 해줌
  - friction : 마찰력, 값이 커질 수록 물체가 더 디게 움직임
  - restitution : 탄성, 값이 커질 수록 물체가 더 높게 튀어오름
- Body() : 질량을 가진 하나의 핵심적인 핵을 만드는 것
  - mass : 질량 , 0이면 물체가 움직이지 않음, 양의 정수로 값을 준다면 질량을 가지면서 중력에 따라 떨어짐

* addBody() : 물리공간에 만든 shape과 material에 따른 body라는 물체 추가

```
    const geometry = new THREE.BoxGeometry(6, 1, 6);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    scene.add(mesh);

  //geometry에서 설정한 width, height, depth를 2로 나눈 값으로 설정
    // 이렇게 해야  width, height, depth 각각 중심에서 모양을 만들 수 있도록 CANNONjs에서 그림을 그려줌
    const shape = new CANNON.Box(new CANNON.Vec3(6 / 2, 1 / 2, 6 / 2));

    const floorMaterial = new CANNON.Material({
      friction: 0.1,
      restitution: 0.5
    });


    const body = new CANNON.Body({ shape, material: floorMaterial, mass: 0 });
    world.addBody(body);
```

### world에 추가되어있는 box 물체의 위치와 threejs mesh로 만들었던 box의 위치를 애니메이션 함수내에서 동기화

- 이 작업을 해줘야 결과물이 제대로 보임
- step() : 아래 코드는 60분의 1프레임마다 world에 있는 모든 물체에 상태 업데이트

* 모든 mesh와 body객체를 동기화 : 위치와 회전값을 copy 해준다.

```
  const draw = () => {
    controls.update();
    renderer.render(scene, camera);

    world.step(1 / 60);
    // worldObjects 모든 mesh와 body를 담아준 객체이다.
    worldObjects.forEach(({ mesh, body }) => {
      mesh.position.copy(body.position);
      //회전값, rotation보다 더 정확한 단위라고함
      mesh.quaternion.copy(body.quaternion);
    });

    requestAnimationFrame(() => {
      draw();
    });
  };


```

## cannonjs의 강의에서 사용한 여러 함수들

### ContactMaterial

- 두 물체사이의 Material을 개별적으로 설정한다면 마찰력과 반발력을 계산할 때 정확하지 않은 값이 나올 수 있음.
  - 여기서 두 물체란 예를 들어 바닥과 바닥 위에 있는 공과 같은 것, 공body에 질량을 주면 떨어져서 바닥에 닿았을 때 restitution 설정값이 있다면 튀어오를 것이다.
  - 그런데 바닥이 모래사장(restitution 값이 작다)이냐 빙판(restitution값이 크다)이냐에 따라 튀어오르는 정도가 다르다. 즉 바닥body에도 restitution 속성이 있다.
  - 이러한 두 물체에 개별적으로 restitution값을 준다면 정확하지 않을 수 있다는 뜻임.
- 그렇기 때문에 두 물체의 Material을 결합해서 좀 더 정확하게 계산해줄 수 있는 ContactMaterial이라는 CannonJS에서 제공해주는 거 사용하면됨.

```
  const floorMaterial = new CANNON.Material("floor");
  const sphereMaterial = new CANNON.Material("sphere");
  //두개의 material을 인자로 받는다
  const contactMaterial = new CANNON.ContactMaterial(
    floorMaterial,
    sphereMaterial,
    {
      friction: 0.1,
      restitution: 0.5,
    }
  );
  world.addContactMaterial(contactMaterial);
```
