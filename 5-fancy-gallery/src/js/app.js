import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl?raw";
import fragmentShader from "../shaders/fragment.glsl?raw";
import ASScroll from "@ashthornton/asscroll";
import gsap from "gsap";

const asscroll = new ASScroll({
  disableRaf: true
});
asscroll.enable();

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true
  });

  const container = document.querySelector("#container");

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const clock = new THREE.Clock();
  const textureLoader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 50);
  camera.fov = Math.atan(canvasSize.height / 2 / 50) * (180 / Math.PI) * 2; //시야각

  const imageRepository = [];
  const loadImages = async () => {
    const images = [...document.querySelectorAll("main .content img")];

    const fetchImages = images.map(
      (image) =>
        new Promise((resolve, reject) => {
          image.onload = resolve(image);
          image.onerror = reject;
        })
    );
    const loadedImages = await Promise.all(fetchImages);
    return loadedImages;
  };

  const createImages = (images) => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {
          value: null
        },
        uTime: {
          value: 0
        },
        uHover: {
          value: 0
        }
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide
    });

    const imageMeshes = images.map((image) => {
      const { width, height } = image.getBoundingClientRect();
      const clonedMaterial = material.clone();
      clonedMaterial.uniforms.uTexture.value = textureLoader.load(image.src);

      const geometry = new THREE.PlaneGeometry(width, height, 16, 16);
      const mesh = new THREE.Mesh(geometry, clonedMaterial);

      imageRepository.push({ img: image, mesh });

      return mesh;
    });

    return imageMeshes;
  };

  const create = async () => {
    const loadedImages = await loadImages();
    const images = createImages([...loadedImages]);
    scene.add(...images);
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.fov = Math.atan(canvasSize.height / 2 / 50) * (180 / Math.PI) * 2; //시야각
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    //현재 화면에 현재 디바이스 픽셀의 비율에 맞는 값을 renderer에 넘겨줌
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const retransform = () => {
    imageRepository.forEach(({ img, mesh }) => {
      const { width, height, top, left } = img.getBoundingClientRect();
      const { width: originWidth } = mesh.geometry.parameters;
      const scale = width / originWidth;
      mesh.scale.x = scale;
      mesh.scale.y = scale;

      mesh.position.y = canvasSize.height / 2 - height / 2 - top;
      mesh.position.x = -canvasSize.width / 2 + width / 2 + left;
    });
  };

  const addEvent = () => {
    window.addEventListener("resize", resize);
    imageRepository.forEach(({ img, mesh }) => {
      // 이렇게 적용해도 바로 적용안됨. canvas(#container)가 img 보다 위에 있어서, css에서 #container의 z-index를 -1로 설정해줘야함.
      img.addEventListener("mouseenter", () => {
        //그냥 1로 바로 주면 갑자기 이벤트가 발생해 부자연스러워서 서서히 발생하도록 gsap으로 효과 추가
        gsap.to(mesh.material.uniforms.uHover, {
          value: 1,
          duration: 0.4,
          ease: "power1.inOut"
        });
      });
      img.addEventListener("mouseout", () => {
        gsap.to(mesh.material.uniforms.uHover, {
          value: 0,
          duration: 0.4,
          ease: "power1.inOut"
        });
      });
    });
  };

  const draw = () => {
    renderer.render(scene, camera);
    retransform();
    asscroll.update();
    imageRepository.forEach(({ mesh }) => {
      mesh.material.uniforms.uTime.value = clock.getElapsedTime();
    });

    requestAnimationFrame(() => {
      draw();
    });
  };

  const initialize = async () => {
    await create();
    addEvent();
    resize();
    draw();
  };

  initialize();
}
