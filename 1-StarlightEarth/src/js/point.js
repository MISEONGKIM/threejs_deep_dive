import * as THREE from "three";

export class Point {
  create({ point }) {
    const position = this.convertLatLngToPos(point, 1.3);

    // 도넛모양
    const geometry = new THREE.TorusGeometry(0.02, 0.002, 20, 20);
    const material = new THREE.MeshBasicMaterial({
      color: 0x263d64,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(position.x, position.y, position.z);
  }

  convertLatLngToPos(pos, radius) {
    const x = Math.cos(pos.lat) * Math.sin(pos.lng) * radius;
    const y = Math.sin(pos.lat) * radius;
    const z = Math.cos(pos.lat) * Math.cos(pos.lng) * radius;

    return { x, y, z };
  }

  createCurve(endPosition) {
    const points = [];
    const startPosition = this.mesh.position;
    //부드러운 곡선을 위해 적당히 100개 좌표 생성
    for (let i = 0; i <= 100; i++) {
      //두 좌표사이에 i번째 해당하는 정점을 구하는 것
      //두 백터(startPosition, endPosition)사이에 어떤 숫자가 있을 것인지 추정해서 반환해주는 함수
      const pos = new THREE.Vector3().lerpVectors(
        startPosition,
        endPosition,
        i / 100
      );

      //구의 반지름의 크기만큼 쉽게 곱해서 사용하기 위해
      //단위를 1미만으로 정규화
      pos.normalize();

      const wave = Math.sin((Math.PI * i) / 100);

      //multiplyScalar 설정해서 커브의 크기를 키워준다.
      //1. 지구 mesh의 반지름 크기가 1.3이라서 1.3설정 => 이까지하면 지구 둘레에 딱맞게 커브 커짐.
      //2. 좀더 커브를 위로 휘도록 만들기 위해 i번째일 때 높이 값
      //3. 0.4 : 얼마나 휘게 만들지 사이즈 값
      pos.multiplyScalar(1.3 + 0.4 * wave);

      points.push(pos);
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 20, 0.003);

    const graidentCanvas = this.getGradientCanvas("#757F94", "#263D74");
    const texture = new THREE.CanvasTexture(graidentCanvas);

    const metarial = new THREE.MeshBasicMaterial({
      map: texture,
    });

    this.curve = new THREE.Mesh(geometry, metarial);
  }

  //threejs에선 gradient 설정 없음 그래서 canvas 이용
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
}
