import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export class PostProcessing {
  constructor({
    renderTarget,
    renderer,
    scene,
    camera,
    canvasSize,
    earthGroup
  }) {
    this.effectComposer = new EffectComposer(renderer, renderTarget);

    const renderPass = new RenderPass(scene, camera);
    this.effectComposer.addPass(renderPass);
    this.scene = scene;
    this.camera = camera;
    this.earthGroup = earthGroup;
    this.canvasSize = canvasSize;
  }
  addPass = () => {
    const filmPass = new FilmPass(1, 1, 2000, false);
    // this.effectComposer.addPass(filmPass);

    // GammaCorrectionShader : 빛의 감도 신호를 보정
    const shaderPass = new ShaderPass(GammaCorrectionShader);

    const unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.canvasSize.width, this.canvasSize.height)
    );
    unrealBloomPass.strength = 0.4;
    unrealBloomPass.threshold = 0.2;
    unrealBloomPass.radius = 0.7;
    // this.effectComposer.addPass(unrealBloomPass);
    this.effectComposer.addPass(shaderPass);

    const smaaPass = new SMAAPass();
    this.effectComposer.addPass(smaaPass);
    this.customPass();
  };

  customPass = () => {
    /**
     * position 변수는 내장되어있어서 사용할 수 있음
     *
     */
    const customShaderPass = new ShaderPass({
      uniforms: {
        uBrightness: { value: 0.3 },
        uPosition: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Vector3(0, 0, 0.15) },
        uAlpha: { value: 0.5 },
        tDiffuse: { value: null } //포스트 프로세싱에서 이미 정의되어있는 변수 이름, 포스트 프로세싱 파이프라인에 따라 렌더링하던 지구와 별, 커브를 포함한 모든 물체가 하나의 텍스처 이미지로서 tDiffuse에 저장됨
        // 이 데이터를 fragmentShader로 넘겨 픽셀의 색상값을 사용할 수 있도록 하는 것
      },
      vertexShader,
      fragmentShader
    });

    this.effectComposer.addPass(customShaderPass);
  };
}
