import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

export class PostProcessing {
  constructor({
    renderTarget,
    renderer,
    scene,
    camera,
    canvasSize,
    earthGroup,
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
    const filmPass = new FilmPass(1, 1, 4096, false);
    // this.effectComposer.addPass(filmPass);

    // GammaCorrectionShader : 빛의 감도 신호를 보정
    const shaderPass = new ShaderPass(GammaCorrectionShader);
    const glitchPass = new GlitchPass();
    // this.effectComposer.addPass(glitchPass);
    // glitchPass.goWild = true;

    const afterimagePass = new AfterimagePass(0.96);
    // this.effectComposer.addPass(afterimagePass);

    const halftonePass = new HalftonePass(
      this.canvasSize.width,
      this.canvasSize.height,
      {
        radius: 10,
        shape: 1,
        scatter: 0,
        blending: 1,
      }
    );

    // effectComposer.addPass(halftonePass);

    const unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.canvasSize.width, this.canvasSize.height)
    );
    // unrealBloomPass.strength = 1;
    // unrealBloomPass.threshold = 0.1;
    // unrealBloomPass.radius = 1;
    // effectComposer.addPass(unrealBloomPass);
    this.effectComposer.addPass(shaderPass);

    const outlinePass = new OutlinePass(
      new THREE.Vector2(this.canvasSize.width, this.canvasSize.height),
      this.scene,
      this.camera
    );
    outlinePass.selectedObjects = [...this.earthGroup.children];
    // outlinePass.edgeStrength = 5;
    // outlinePass.edgeGlow = 5;
    // outlinePass.pulsePeriod = 5;

    this.effectComposer.addPass(outlinePass);

    const smaaPass = new SMAAPass();
    this.effectComposer.addPass(smaaPass);
  };
}
