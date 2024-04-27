import { renderModel } from "./renderer/dam";
import { Devtool } from "./devtool/devtool";
import { HubType, IModelLoaded, hub } from "./devtool/hub";
import { Toaster } from "@/components/ui/sonner";
import * as THREE from "three";
import { global } from "./global";

/**
 * App
 */
export default function App() {
  return (
    <div>
      <canvas id="contianer" className="bg-gray-100 w-full h-[600px] fixed left-0 top-0"></canvas>
      <Devtool></Devtool>
      <Toaster position="top-center"></Toaster>
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const el = document.getElementById("contianer")! as HTMLCanvasElement;
    renderModel(el).then((data) => {
      const { scene, camera, renderer } = data;
      const payload: IModelLoaded = { scene, camera, renderer };
      hub.emit(HubType.ModelLoaded, payload);
      window.addEventListener("click", (e) => onClickMesh(e, camera, scene));
    });
  }, 10);
});

// 点击事件处理函数
function onClickMesh(event: MouseEvent, camera: THREE.Camera, scene: THREE.Scene) {
  // 计算点击位置的归一化设备坐标
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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
      global.selectedMesh = meshes;
    }
  }
}
