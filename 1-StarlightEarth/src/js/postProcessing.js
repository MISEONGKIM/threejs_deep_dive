import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

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
    const filmPass = new FilmPass(1, 1, 4096, false);
    // this.effectComposer.addPass(filmPass);

    // GammaCorrectionShader : 빛의 감도 신호를 보정
    const shaderPass = new ShaderPass(GammaCorrectionShader);

    const unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.canvasSize.width, this.canvasSize.height)
    );
    // unrealBloomPass.strength = 1;
    // unrealBloomPass.threshold = 0.1;
    // unrealBloomPass.radius = 1;
    // effectComposer.addPass(unrealBloomPass);
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
        uBrightness: { value: 1 },
        uPosition: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Vector3(0, 0, 1) },
        uAlpha: { value: 0.5 },
        tDiffuse: { value: null } //포스트 프로세싱에서 이미 정의되어있는 변수 이름, 포스트 프로세싱 파이프라인에 따라 렌더링하던 지구와 별, 커브를 포함한 모든 물체가 하나의 텍스처 이미지로서 tDiffuse에 저장됨
        // 이 데이터를 fragmentShader로 넘겨 픽셀의 색상값을 사용할 수 있도록 하는 것
      },
      /** glsl로 작성 */
      vertexShader: `
       varying vec2 vUv;

       void main() {
        gl_Position  = vec4(position.x, position.y, 0.0, 1.0);
        vUv = uv;
       }
      `, //영역생성
      fragmentShader: `
      uniform float uBrightness;
      uniform vec2 uPosition;
      uniform vec3 uColor;
      uniform sampler2D tDiffuse;

      varying vec2 vUv;

       void main() {
        //새로운 uv생성해서 좌표 수정
        // 지구가 왼쪽으로 0.2만큼 이동, UV의 값이 0 ~ 1 사이에서 0.2 ~ 1.2사이로 바꼈기 때문
        // 이에 따라 텍스처를 매핑하는 과정에서 0부터 0.2사이만큼 밀린 거
        // 원래있던 텍스처에 (0,0) 에서부터 샘플링 되던 게 (0.2, 0) 에서부터 샘플링이 되면서 1을 초과하는 1에서 1.1사이의 텍스처는 외곡되는 것 처럼 보임
        // 이렇게 UV값을 변형을 주는 건  디스토션이라는 외곡효과를 줄 때 자주 사용하는 기법 중에 하나 
        // vec2 newUV = vec2(vUv.x + 0.2, vUv.y); 

        vec2 newUV = vec2(vUv.x, vUv.y); 

        vec4 tex = texture2D(tDiffuse, newUV);
        tex.rgb += uColor;

        //더 빛나게 
        // brightness 값이 더 작아질 수록 tex의 값은 더 높아질 거고 높아진 만큼 더 하얗게, 즉 더 밝아짐
        // float brightness = 0.1;

        // 왼쪽이 엄청 밝은 느낌 
        // sin에서  vUv.x 값이 0일때는 brightness값도 0 이므로 굉장히 밝아짐 , 반면에 좌표가 증가할 술록 1에 가까워지므로 
        float brightness = sin(uBrightness + vUv.x);
        

        gl_FragColor = tex / brightness;
       }
      ` //픽셀마다 색 입힘
    });

    this.effectComposer.addPass(customShaderPass);
  };
}
