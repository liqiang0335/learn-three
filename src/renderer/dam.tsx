import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { addDirectLightSetting } from "../devtool/helpers/light-direction";
import { addRectLighgtSetting } from "../devtool/helpers/light-rectarea";
import { addCameraSetting } from "../devtool/helpers/camera";
import * as dat from "dat.gui";
import { global } from "@/global";

/**
 * @param container - The id of the container element
 */
export async function renderModel(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
  camera.position.z = 0;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });

  // 设置背景色
  renderer.setClearColor("rgb(200,200,200)");
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  const loader = new GLTFLoader();
  loader.load("demo/Dam_Rename2.glb", (gltf) => {
    const model = gltf.scene;
    global.model = model;

    const colors = ["rgb(160,160,160)", "rgb(165,165,165)", "rgb(170,170,170)", "rgb(175,175,175)", "rgb(180,180,180)"];
    const colorLength = colors.length;
    let i = 0;

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // 为每个网格对象设置不同的颜色, 以便区分
        const index = i++ % colorLength;
        const color = colors[index];
        // 保存原始颜色值
        child.userData.originColor = color;
        // 设置材质
        child.material = new THREE.MeshPhongMaterial({ color });
      }
    });

    model.scale.set(1, 1, 1);
    scene.add(model);

    const gui = new dat.GUI({ name: "xxx", autoPlace: true, width: 300 });
    const commonOption = { scene, camera, renderer, gui };

    addCameraSetting({ uuid: "IR3UBP6M", ...commonOption });
    addDirectLightSetting({ uuid: "CYSX46X6", ...commonOption });
    // addRectLighgt({ uuid: "ADZV91T9", scene, gui });

    // END ======================
  });

  return { scene, camera, renderer };
}
