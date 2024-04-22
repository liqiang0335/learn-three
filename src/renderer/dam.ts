import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * @param container - The id of the container element
 */
export async function renderModel(container: string) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: document.getElementById(container) as HTMLCanvasElement,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 5;

  const loader = new GLTFLoader();
  loader.load("demo/Dam_Rename2.glb", (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.05, 0.05, 0.05);
    scene.add(model);
  });

  return { scene, camera, renderer };
}
