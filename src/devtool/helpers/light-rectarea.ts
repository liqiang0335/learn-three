import * as THREE from "three";
import localforage from "localforage";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { IHelper } from "./helper";
import { removeUnserializableProps } from "./helper.utils";
import { toast } from "sonner";
/**
 * 添加平行光设置
 */
export async function addRectLighgtSetting({ uuid, scene, gui }: IHelper) {
  const folder = gui.addFolder("平面光源设置");

  const light = new THREE.RectAreaLight(0xffffff, 1);
  const helper = new RectAreaLightHelper(light);

  const option: { [key: string]: any } = {
    颜色: "#ff0000", // 光源颜色
    强度: 1, // 光源强度
    辅助线: true, // 是否显示辅助线
    X坐标: 1, // 光源位置X
    Y坐标: 1, // 光源位置Y
    Z坐标: 0, // 光源位置Z
    save() {
      localforage.setItem(uuid, removeUnserializableProps(option)).then(() => {
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
      if (option.辅助线) {
        scene.add(helper);
      }
      folder.updateDisplay();
    }
  });

  folder.addColor(option, "颜色").onChange((value) => {
    light.color.set(value);
  });

  folder.add(option, "强度", 1, 100, 1).onChange((value) => {
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
