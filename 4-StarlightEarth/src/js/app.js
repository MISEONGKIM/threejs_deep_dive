import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "../shaders/earth/vertex.glsl?raw";
import fragmentShader from "../shaders/earth/fragment.glsl?raw";
import pointVertexShader from "../shaders/earthPoints/vertex.glsl?raw";
import pointFragmentShader from "../shaders/earthPoints/fragment.glsl?raw";

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.setClearColor(0x000000, 1);

  const container = document.querySelector("#container");

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const textureLoader = new THREE.TextureLoader();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const createEarth = () => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {
          value: textureLoader.load("assets/earth-specular-map.png"),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const geometry = new THREE.SphereGeometry(0.8, 30, 30);

    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  };
  const createEarthPoints = () => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {
          value: textureLoader.load("assets/earth-specular-map.png"),
        },
      },
      vertexShader: pointVertexShader,
      fragmentShader: pointFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
    //SphereGeometry, IcosahedronGeometry로 각각 생성하니 텍스처의 위치가 좀 다름. 계산방식이 다른거같다고 함
    //IcosahedronGeometry로 생성할 땐 texture 위치가 다를 수 있다는 점을 기억
    const geometry = new THREE.IcosahedronGeometry(0.9, 40, 40);
    // 위치 조정
    geometry.rotateY(-Math.PI);

    const mesh = new THREE.Points(geometry, material);

    return mesh;
  };

  const create = () => {
    const earth = createEarth();
    const earthPoints = createEarthPoints();
    scene.add(earth, earthPoints);
  };

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
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(() => {
      draw();
    });
  };

  const initialize = () => {
    create();
    addEvent();
    resize();
    draw();
  };

  initialize();
}
