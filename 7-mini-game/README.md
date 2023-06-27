# 미니게임

## CANNON.Body에서 사용한 함수들

- postStep 이벤트 : 물리 시뮬레이션에서 한 step이 지난 다음 호출되는 이벤트
  - world에선 step()을 이용해서 매 step을 update해줌, 그 때마다 호출되는 이벤트라고 보면 됨.

```
//this가 CANNON.Body임, Player.js 소스 참고
this.phsics.addEventListener("postStep", () => {});
```

- applyImpluse() : 힘을 가하는 여러 함수가 있는 데, 이 함수는 순간적인 충격을 주는 함수
  - 인자로 힘 vec3값을 준다. 아래 소스는 z방향으로 -하면 뒤쪽(안쪽)으로 힘 가한다는 의미, +는 앞쪽(바깥쪽)으로 힘 가한다는 의미

```
//this가 CANNON.Body임,  Player.js 소스 참고
  this.applyImpluse(new CANNON.Vec3(0, 0, -1));
  this.applyImpluse(new CANNON.Vec3(0, 0, 1));
```

- collide 이벤트 : 충돌했을 때 호출되는 이벤트

```
  this.addEventListener('collide', (e) => {});
```
