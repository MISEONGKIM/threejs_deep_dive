import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Player extends THREE.Mesh {
  name = "player";

  constructor({ radius, position }) {
    const geometry = new THREE.SphereGeometry(radius, 30, 30);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc
    });

    super(geometry, material);

    this.body = new PhysicsPlayer({ radius, position });
  }
}

class PhysicsPlayer extends CANNON.Body {
  name = "player";

  constructor({ radius, position }) {
    const shape = new CANNON.Sphere(radius);
    const material = new CANNON.Material({
      friction: 0.1,
      restitution: 0.5
    });

    super({ shape, material, mass: 10, position });
  }
}
