import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

/**
 * @param container - The id of the container element
 */
export async function renderModel(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

    // 添加 DirectionalLight 光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1.5, 1, 0);
    directionalLight.target = model;
    scene.add(directionalLight);

    // 添加rectAreaLight光源
    const rectAreaLight = new THREE.RectAreaLight(0xffffff, 1, 1, 1);
    rectAreaLight.position.set(0, 0, 0);
    rectAreaLight.lookAt(0, 0, 0);
    rectAreaLight.intensity = 1000;
    scene.add(rectAreaLight);

    // 添加 RectAreaLight Helper 辅助线
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(directionalLightHelper);

    const gui = new dat.GUI({ name: "MyGUI", autoPlace: true, width: 300, closed: false });

    const folder1 = gui.addFolder("平行光");
    folder1.closed = false;

    const directionalLightOption = {
      enableHelper: true,
    };

    folder1.add(directionalLight.position, "x", -5, 5);
    folder1.add(directionalLight.position, "y", -5, 5);
    folder1.add(directionalLight.position, "z", -5, 5);
    folder1.add(directionalLightOption, "enableHelper").onChange((value) => {
      return value ? scene.add(directionalLightHelper) : scene.remove(directionalLightHelper);
    });
  });

  return { scene, camera, renderer };
}
