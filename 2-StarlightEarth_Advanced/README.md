# 지구 만들기 advanced

앞선 프로젝트 1-StarlightEarth에서는 포스트 프로세싱을 이용해서 셰이더를 scene 전체에 적용하는 방식(ShaderPass이용), 해당 프로젝트에선 **각각 mesh에 셰이더를 적용하는 방식**

## RawShaderMaterial, ShaderMaterial라는 재질을 사용하면 셰이더 효과 입힐 수 있음.

- 아래 코드처럼 조회해보면, data에 vertexShader, fragmentShader, uniforms 값이 있음, 셰이더 코드를 이미 사용하고 있는 것 !
  - 즉, threejs는 우리가 셰이더를 만들기 이전에 먼저 몇가지 프리셋을 작성해놓고 있던 거임!
  * MeshBasicMaterial도 결국 glsl 언어로 구현된 셰이더 코드로 작성한 프로그램을 전달해주는 개체의 역할을 한다는 거임.
  * 즉, 직접 셰이더 만들어서 커스텀 Material 생성 가능하다는 거임 ! 그때 이용하는 게 => RawShaderMaterial, ShaderMaterial

```
 const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      onBeforeCompile: (data) => {
        console.log(data); //조회
      }
    });

```

### RawShaderMaterial

- ShaderMaterial과 달리 미리 전역으로 사용하는 uniforms와 attributes 같은 값이 따로 정의되어 있지 않음

* gl_Position : 클립공간에서 정점의 위치를 지정하는 정점 셰이더의 특수한 전역 변수
* projectionMatrix : 3D 장면이 2D 뷰포트에 투영되는 방식을 제어하는 데 사용, 2D의 클립공간 좌표를 만드는 역할을 함, 공간 좌표를 만들기 위해 가장 먼저 가져와야하는 좌표
* viewMatrix : 카메라가 물체를 어떻게 바라보고 있는 지 정보, 카메라의 위치/회전/종횡비/어디까지 포착할 것 인지에 대한 정보를 담고 있는 변수
* modelMatrix : mesh의 위치 회전,스케일과 같은 transform 정보를 담고 있는 변수
* modelViewMatrix : viewMatrix, modelMatrix 합체한 거 !

* projectionMatrix \* viewMatrix \* modelMatrix : 행렬 연산하도록 곱함. 이에 따라 카메라와 카메라에 담겨 있는 모델의 정보 계산됨

* position : Geometry의 포지션 정보, BufferGeometry에서 제공해주는 정점의 위치값을 의미
* vertexShader는 각 정점마다 실행되는 프로그램이기 때문에 gl_Position에 정점의 위치데이터를 넘겨주어야 한다.(=> 곱하기 vec4(position, 1.0) 해주는 것)
  - 1.0 : 원근값에 영향을 주는 숫자임
* **곱해주는 순서 지키는 거 중요하다**

```
 const material = new THREE.RawShaderMaterial({
      color: 0x00ff00,
      vertexShader: `
      uniform mat4 projectionMatrix;
      uniform mat4 viewMatrix;
      uniform mat4 modelMatrix;
      attribute vec3 position; //BufferGeometry에서 제공해주는 정점의 위치값

      void main() {
        // 정점의 셰이더 완성
        // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
     `
    });
```
