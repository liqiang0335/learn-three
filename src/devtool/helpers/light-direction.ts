import * as THREE from "three";
import localforage from "localforage";
import { IHelper } from "./helper";
import { toast } from "sonner";

/**
 * 添加平行光设置
 */
export async function addDirectLightSetting({ uuid, scene, gui }: IHelper) {
  const folder = gui.addFolder("平行光设置");

  // 添加 DirectionalLight 光源
  const light = new THREE.DirectionalLight(0xffffff, 1);
  const helper = new THREE.DirectionalLightHelper(light);

  const option: { [key: string]: any } = {
    颜色: "#ff0000", // 光源颜色
    强度: 1, // 光源强度
    辅助线: true, // 是否显示辅助线
    X坐标: 1, // 光源位置X
    Y坐标: 1, // 光源位置Y
    Z坐标: 0, // 光源位置Z
    save() {
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
  };

  // 读取本地存储的数据
  localforage.getItem(uuid).then((value) => {
    if (value) {
      Object.assign(option, value);
      light.color.set(option.颜色);
      light.intensity = option.强度;
      light.position.set(option.X坐标, option.Y坐标, option.Z坐标);
      if (option.辅助线) scene.add(helper);
      folder.updateDisplay();
    }
  });

  folder.addColor(option, "颜色").onChange((value) => {
    light.color.set(value);
  });

  folder.add(option, "强度", 0.1, 5, 0.1).onChange((value) => {
    light.intensity = value;
  });

  folder.add(option, "辅助线").onChange((value) => {
    return value ? scene.add(helper) : scene.remove(helper);
  });

  folder.add(option, "X坐标", -50, 50, 1).onChange((value) => {
    light.position.setX(value);
  });

  folder.add(option, "Y坐标", -50, 50, 1).onChange((value) => {
    light.position.setY(value);
  });

  folder.add(option, "Z坐标", -50, 50, 1).onChange((value) => {
    light.position.setZ(value);
  });

  folder.add(option, "save");

  scene.add(light);
}
