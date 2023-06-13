import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";

export class PostProcessing {
  constructor({ renderer, scene, camera }) {
    this.effectComposer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    this.effectComposer.addPass(renderPass);
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

    this.effectComposer.addPass(shaderPass);
  };
}
