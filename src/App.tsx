import { renderModel } from "./renderer/dam";
import { Devtool } from "./devtool/devtool";
import { HubType, IModelLoaded, hub } from "./devtool/hub";
import { Toaster } from "@/components/ui/sonner";
import * as THREE from "three";
import { global } from "./global";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment, OrbitControls } from "@react-three/drei";
import { useReducerWrap } from "./devtool/hooks/useReducerWrap";
import { useEffect } from "react";

/**
 * App
 */
export default function App() {
  return (
    <div>
      <canvas width="1200" height="400" id="contianer1" className="bg-gray-100 fixed left-0 top-0"></canvas>
      <div className="w-[1200px] h-[300px] fixed left-0 top-[410px] bg-gray-100">
        <Dam></Dam>
      </div>
      <Devtool></Devtool>
      <Toaster position="top-center"></Toaster>
    </div>
  );
}

function Dam() {
  return (
    <Canvas>
      <camera position={[10, 10, 10]} />
      <OrbitControls></OrbitControls>
      <Environment preset="sunset" />
      <Scene></Scene>
    </Canvas>
  );
}

function Scene() {
  const gltf = useLoader(GLTFLoader, "/demo/Dam_Rename2.glb");
  const [state, dispatch] = useReducerWrap({
    code: "dam-2-1",
  });

  useEffect(() => {
    hub.on(HubType.Selected, (payload: string) => {
      dispatch({ code: payload });
    });
  }, []);

  const scene = gltf.scene.clone();
  scene.scale.set(0.1, 0.1, 0.1);
  scene.children = scene.children.filter((it) => {
    return it.name.startsWith(state.code);
  });
  return <primitive object={scene} />;
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const el = document.getElementById("contianer1")! as HTMLCanvasElement;
    renderModel(el).then((data) => {
      const { scene, camera, renderer } = data;
      const payload: IModelLoaded = { scene, camera, renderer };
      hub.emit(HubType.ModelLoaded, payload);
      window.addEventListener("click", (e) => onClickMesh({ event: e, camera, scene, width: 1200, height: 400 }));
    });
  }, 10);
});

// 点击事件处理函数
function onClickMesh({
  event,
  camera,
  scene,
  width,
  height,
}: {
  event: MouseEvent;
  camera: THREE.Camera;
  scene: THREE.Scene;
  width: number;
  height: number;
}) {
  // 计算点击位置的归一化设备坐标
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // 将点击位置的屏幕坐标转换成three.js中的标准坐标
  mouse.x = (event.clientX / width) * 2 - 1;
  mouse.y = -(event.clientY / height) * 2 + 1;

  // 发射一条射线
  raycaster.setFromCamera(mouse, camera);
  // 获取所有被射线相交的对象
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    // 清空之前选中的物体颜色
    global.selectedMesh.forEach((mesh) => {
      mesh.material = new THREE.MeshPhongMaterial({ color: mesh.userData.originColor });
    });
    // 清空之前选中的物体
    global.selectedMesh = [];

    // 点击的物体
    const clicked = intersects[0].object;
    const parent = clicked.parent;
    // 检测组名是否以dam-开头
    const isGroup = parent?.name.startsWith("dam-");
    if (isGroup) {
      const [damCode] = parent!.name.split("_");

      // 遍历模型，找到相同组的物体
      const groups = global.model!.children.filter((it) => it.name.startsWith(damCode));

      // 获取所有物体
      const meshes = groups.map((group) => group.children).flat() as THREE.Mesh[];
      // 高亮物体设置为红色
      meshes.forEach((item) => {
        item.material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      });

      hub.emit(HubType.Selected, damCode);

      // 保存选中的物体
      global.selectedMesh = meshes;
    }
  }
}
