import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl?raw";
import fragmentShader from "../shaders/fragment.glsl?raw";
import ASScroll from "@ashthornton/asscroll";
import gsap from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import postVertexShader from "../shaders/postprocessing/vertex.glsl?raw";
import postFragmentShader from "../shaders/postprocessing/fragment.glsl?raw";

import Swup from "swup";
import SwupJsPlugin from "@swup/js-plugin";

let asscroll = asscrollCreate();

function asscrollCreate() {
  const ass = new ASScroll({
    disableRaf: true,
  });
  ass.enable();
  return ass;
}

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  const composer = new EffectComposer(renderer);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const raycaster = new THREE.Raycaster();
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

  let imageRepository = [];
  let animationId = "";
  // in : 페이지에 들어왔을 때, out : 페이지에서 나왔을 때
  const swup = new Swup({
    plugins: [
      new SwupJsPlugin([
        {
          from: "(.*)",
          to: "(.*)",
          in: (next, infos) => {
            document.querySelector("#swup").style.opacity = 0;
            gsap.to(document.querySelector("#swup"), {
              duration: 0.5,
              opacity: 1,
              onComplete: () => {
                next();
                // 다시 초기화해주는 작업들
                asscroll = asscrollCreate();

                initialize();
              },
            });
          },
          out: (next, infos) => {
            // 페이지 나갈 경우 clear, 안해주면 페이지 이동하고 나서 새로 또 생성하니까 스크롤도 작동안되고 이미지도 안뜸
            asscroll.disable();

            imageRepository.forEach(({ mesh }) => {
              scene.remove(mesh);
            });
            imageRepository = [];

            window.removeEventListener("resize", resize);
            window.cancelAnimationFrame(animationId);

            document.querySelector("#swup").style.opacity = 1;
            gsap.to(document.querySelector("#swup"), 0, {
              duration: 0.5,
              opacity: 0,
              onComplete: next,
            });
          },
        },
      ]),
    ],
  });

  const loadImages = async () => {
    const images = [...document.querySelectorAll("main .content img")];

    const fetchImages = images.map(
      (image) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image.src;
          img.onload = resolve(image);
          img.onerror = reject;
        })
    );
    const loadedImages = await Promise.all(fetchImages);
    return loadedImages;
  };

  const createImages = (images) => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {
          value: null,
        },
        uTime: {
          value: 0,
        },
        uHover: {
          value: 0,
        },
        uHoverX: { value: 0.5 },
        uHoverY: { value: 0.5 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
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

    composer.setSize(canvasSize.width, canvasSize.height);
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

  const addPostEffects = () => {
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    //ShaderMaterial로 pass해야 draw함수에서 매 프레임마다 uTime값이 증가된 게 올바르게 적용됨.
    // 일반 객체로 넘겨주니 uTime값에 따라 애니메이션이 적용되지 않음.
    const customShader = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uScrolling: {
          value: 0,
        },
      },
      vertexShader: postVertexShader,
      fragmentShader: postFragmentShader,
    });
    const customPass = new ShaderPass(customShader);
    composer.addPass(customPass);

    return { customShader };
  };

  const addEvent = (effects) => {
    const { customShader } = effects;
    // targetPos : 컨텐츠를 스크롤했을 때 해당 컨텐츠의 위치
    asscroll.on("update", ({ targetPos, currentPos }) => {
      const speed = Math.abs(targetPos - currentPos);

      //speed가 5이상일 때 스크롤했다라고 판단
      if (speed > 5) {
        gsap.to(customShader.uniforms.uScrolling, {
          value: 1,
          duration: 0.5,
        });
        return;
      }
      gsap.to(customShader.uniforms.uScrolling, {
        value: 0,
        duration: 0.5,
      });
    });

    //마우스 포인트에 따라서 물결 효과를 주기 위해
    window.addEventListener("mousemove", (e) => {
      const pointer = {
        //e.clientX / canvasSize.width => 0 ~ 1 사이의 값
        //-1 ~ 1 사이의 값
        x: (e.clientX / canvasSize.width) * 2 - 1,
        // threejs는 위쪽이 + 아래쪽이 -라서 -1을 곱해줌
        y: -(e.clientY / canvasSize.height) * 2 + 1,
      };
      raycaster.setFromCamera(pointer, camera);

      // raycaster에 따라서 어떤 mesh가 마우스 위에 있는 지 정보를 얻을 수 있음
      const intersects = raycaster.intersectObjects(scene.children);

      //교차하는 mesh가 없으면 return
      if (intersects.length === 0) return;
      let mesh = intersects[0].object;
      //uHoverX, uHoverY를 shader의 내적 구하는 값에 사용함. fragment.glsl 참고
      //- 0.5 :  -0.5 ~ 0.5 사이의 값을 가지도록 해서 마우스가 정 중앙일 때 물결효과가 멈추도록, 정중앙 좌표가 0,0
      //- 0.5안하면 uv좌표에 따라 좌측하단이 0,0이라서 거기에 마우스를 대면 물결이 안침.
      mesh.material.uniforms.uHoverX.value = intersects[0].uv.x - 0.5;
      mesh.material.uniforms.uHoverY.value = intersects[0].uv.y - 0.5;
    });
    window.addEventListener("resize", resize);
    imageRepository.forEach(({ img, mesh }) => {
      // 이렇게 적용해도 바로 적용안됨. canvas(#container)가 img 보다 위에 있어서, css에서 #container의 z-index를 -1로 설정해줘야함.
      img.addEventListener("mouseenter", () => {
        //그냥 1로 바로 주면 갑자기 이벤트가 발생해 부자연스러워서 서서히 발생하도록 gsap으로 효과 추가
        gsap.to(mesh.material.uniforms.uHover, {
          value: 1,
          duration: 0.4,
          ease: "power1.inOut",
        });
      });
      img.addEventListener("mouseout", () => {
        gsap.to(mesh.material.uniforms.uHover, {
          value: 0,
          duration: 0.4,
          ease: "power1.inOut",
        });
      });
    });
  };

  const draw = (effects) => {
    const { customShader } = effects;
    customShader.uniforms.uTime.value = clock.getElapsedTime();

    composer.render();
    // renderer.render(scene, camera);
    retransform();
    asscroll.update();
    imageRepository.forEach(({ mesh }) => {
      mesh.material.uniforms.uTime.value = clock.getElapsedTime();
    });

    animationId = requestAnimationFrame(() => {
      draw(effects);
    });
  };

  const initialize = async () => {
    const container = document.querySelector("#container");

    container.appendChild(renderer.domElement);

    await create();
    const effects = addPostEffects();
    addEvent(effects);
    resize();
    draw(effects);
  };

  initialize();
}
