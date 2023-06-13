import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Earth } from "./earth.js";
import { Star } from "./star.js";
import { Point } from "./point";
import { PostProcessing } from "./postProcessing.js";

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

  const postProcessing = new PostProcessing({ renderer, scene, camera });

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    postProcessing.effectComposer.setSize(canvasSize.width, canvasSize.height);
  };

  const addEvent = () => {
    window.addEventListener("resize", resize);
  };

  const group = new THREE.Group();
  const stars = new Star({ scene, textureLoader });

  const draw = () => {
    group.rotation.x += 0.0005;
    group.rotation.y += 0.0005;

    stars.points.rotation.x += 0.001;
    stars.points.rotation.y += 0.001;

    controls.update();

    postProcessing.effectComposer.render();
    requestAnimationFrame(() => {
      draw();
    });
  };

  const create = () => {
    const earth1 = new Earth({ textureLoader });
    const earth2 = new Earth({ textureLoader });
    const point1 = new Point();
    const point2 = new Point();

    earth1.create({
      geometryOpt: { radius: 1.3 },
    });
    earth1.addLight({ scene });

    earth2.create({
      materialOpt: {
        opacity: 0.9,
        transparent: true,
        //작은 지구의 앞면이 보이기 위해 바깥 지구에서 뒤쪽부분만 렌더링하고 앞쪽 부분은 렌더링 하지않도록 만듬
        side: THREE.BackSide,
      },
      geometryOpt: { radius: 1.5 },
    });

    stars.create();
    // 서울의 위도(lat)와 경도(lng) 좌표
    point1.create({
      point: {
        //라디안 변환
        lat: 37.56668 * (Math.PI / 180),
        lng: 126.97841 * (Math.PI / 180),
      },
    });
    point1.mesh.rotation.set(0.9, 2.46, 1);
    //가나 위도/경도
    point2.create({
      point: {
        //라디안 변환
        lat: 5.55363 * (Math.PI / 180),
        lng: -0.196481 * (Math.PI / 180),
      },
    });
    point1.createCurve(point2.mesh.position);

    group.add(earth1.mesh, earth2.mesh, point1.mesh, point2.mesh, point1.curve);

    scene.add(group);
  };

  const initialize = () => {
    create();
    postProcessing.addPass();
    addEvent();
    resize();
    draw();
  };

  initialize();
}
