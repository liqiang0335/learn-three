import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { addDirectLightSetting } from "../devtool/helpers/light-direction";
import { addRectLighgtSetting } from "../devtool/helpers/light-rectarea";
import { addCameraSetting } from "../devtool/helpers/camera";
import * as dat from "dat.gui";

/**
 * @param container - The id of the container element
 */
export async function renderModel(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });

  // 设置背景色
  renderer.setClearColor("rgb(200,200,200)");
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);
  camera.position.z = 5;

  const loader = new GLTFLoader();
  loader.load("demo/Dam_Rename2.glb", (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.05, 0.05, 0.05);
    scene.add(model);

    const gui = new dat.GUI({ name: "xxx", autoPlace: true, width: 300 });
    const commonOption = { scene, camera, renderer, gui };

    addCameraSetting({ uuid: "IR3UBP6M", ...commonOption });
    addDirectLightSetting({ uuid: "CYSX46X6", ...commonOption });
    // addRectLighgt({ uuid: "ADZV91T9", scene, gui });

    // END
  });

  return { scene, camera, renderer };
}
