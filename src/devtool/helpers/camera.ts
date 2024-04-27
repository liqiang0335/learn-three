import * as THREE from "three";
import localforage from "localforage";
import { IHelper } from "./helper";
import { toast } from "sonner";

/**
 * 添加平行光
 */
export async function addCameraSetting({ uuid, scene, gui, camera }: IHelper) {
  const folder = gui.addFolder("相机设置");

  // 添加camera辅助线
  const helper = new THREE.CameraHelper(camera);

  const option: { [key: string]: any } = {
    辅助线: true, // 是否显示辅助线
    X坐标: 1, // 位置X
    Y坐标: 1, // 位置Y
    Z坐标: 0, // 位置Z
    save() {
      // remove function type
      const obj: { [key: string]: any } = {};
      for (const key in option) {
        if (typeof option[key] !== "function") {
          obj[key] = option[key];
        }
      }
      localforage.setItem(uuid, obj).then(() => {
        toast.success("保存成功");
      });
    },
    update() {
      option.X坐标 = camera.position.x;
      option.Y坐标 = camera.position.y;
      option.Z坐标 = camera.position.z;
      folder.updateDisplay();
    },
  };

  // 读取本地存储的数据
  localforage.getItem(uuid).then((value) => {
    if (value) {
      Object.assign(option, value);
      camera.position.set(option.X坐标, option.Y坐标, option.Z坐标);
      if (option.辅助线) {
        scene.add(helper);
      }
      folder.updateDisplay();
    }
  });

  folder.add(option, "辅助线").onChange((value) => {
    return value ? scene.add(helper) : scene.remove(helper);
  });

  folder.add(option, "X坐标", -50, 50, 1).onChange((value) => {
    camera.position.setX(value);
  });

  folder.add(option, "Y坐标", -50, 50, 1).onChange((value) => {
    camera.position.setY(value);
  });

  folder.add(option, "Z坐标", -50, 50, 1).onChange((value) => {
    camera.position.setZ(value);
  });

  folder.add(option, "save");
  folder.add(option, "update");

  scene.add(camera);
}
