import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Earth } from "./earth.js";
import { Star } from "./star.js";

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;

  const textureLoader = new THREE.TextureLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const environmentMap = cubeTextureLoader.load([
    "assets/environments/px.png",
    "assets/environments/nx.png",
    "assets/environments/py.png",
    "assets/environments/ny.png",
    "assets/environments/pz.png",
    "assets/environments/nz.png",
  ]);
  environmentMap.encoding = THREE.sRGBEncoding;

  const container = document.querySelector("#container");

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();
  scene.background = environmentMap;
  scene.environment = environmentMap;

  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const addEvent = () => {
    window.addEventListener("resize", resize);
  };

  const draw = () => {
    earth1.mesh.rotation.x += 0.0005;
    earth1.mesh.rotation.y += 0.0005;

    earth2.mesh.rotation.x += 0.0005;
    earth2.mesh.rotation.y += 0.0005;

    stars.points.rotation.x += 0.001;
    stars.points.rotation.y += 0.001;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(() => {
      draw();
    });
  };

  const earth1 = new Earth({ scene, textureLoader });
  const earth2 = new Earth({ scene, textureLoader });
  const stars = new Star({ scene, textureLoader });

  const initialize = () => {
    earth1.createEarth({
      geometryOpt: { radius: 1.3 },
    });
    earth1.addLight();

    earth2.createEarth({
      materialOpt: {
        opacity: 0.9,
        transparent: true,
        //작은 지구의 앞면이 보이기 위해 바깥 지구에서 뒤쪽부분만 렌더링하고 앞쪽 부분은 렌더링 하지않도록 만듬
        side: THREE.BackSide,
      },
      geometryOpt: { radius: 1.5 },
    });

    stars.createStars();

    addEvent();
    resize();
    draw();
  };

  initialize();
}
