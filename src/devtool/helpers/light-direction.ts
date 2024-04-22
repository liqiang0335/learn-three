import * as THREE from "three";
import * as dat from "dat.gui";

/**
 * 添加平行光
 *
 */
export async function addDirectionalLight(name: string, scene: THREE.Scene) {
  const gui = new dat.GUI({ name: name, autoPlace: true, width: 300 });

  const folder = gui.addFolder("平行光设置");

  // 添加 DirectionalLight 光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);

  const option = {
    颜色: "#ff0000", // 光源颜色
    强度: 1, // 光源强度
    辅助线: true, // 是否显示辅助线
    X坐标: 1, // 光源位置X
    Y坐标: 1, // 光源位置Y
    Z坐标: 0, // 光源位置Z
    save() {
      const { save, ...rest } = option;
      console.log(rest);
    },
  };

  folder.addColor(option, "颜色").onChange((value) => {
    directionalLight.color.set(value);
  });

  folder.add(option, "强度", 0, 1, 0.1).onChange((value) => {
    directionalLight.intensity = value;
  });

  folder.add(option, "辅助线").onChange((value) => {
    return value ? scene.add(directionalLightHelper) : scene.remove(directionalLightHelper);
  });

  folder.add(option, "X坐标", -50, 50, 1).onChange((value) => {
    directionalLight.position.setX(value);
  });

  folder.add(option, "Y坐标", -50, 50, 1).onChange((value) => {
    directionalLight.position.setY(value);
  });

  folder.add(option, "Z坐标", -50, 50, 1).onChange((value) => {
    directionalLight.position.setZ(value);
  });

  folder.add(option, "save");

  scene.add(directionalLight);
}
