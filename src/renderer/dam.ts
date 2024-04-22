import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { addDirectionalLight } from "../devtool/helpers/light-direction";

/**
 * @param container - The id of the container element
 */
export async function renderModel(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });

  // 设置背景色为红色
  renderer.setClearColor("rgb(200,200,200)");

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 5;

  const loader = new GLTFLoader();
  loader.load("demo/Dam_Rename2.glb", (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.05, 0.05, 0.05);
    scene.add(model);

    // 添加rectAreaLight光源
    const rectAreaLight = new THREE.RectAreaLight(0xffffff, 1, 1, 1);
    rectAreaLight.position.set(0, 0, 0);
    rectAreaLight.lookAt(0, 0, 0);
    rectAreaLight.intensity = 1000;
    scene.add(rectAreaLight);
  });

  addDirectionalLight("平行光", scene);

  return { scene, camera, renderer };
}
