import * as THREE from "three";
import * as dat from "dat.gui";

export interface IHelper {
  uuid: string; // 唯一标识
  scene: THRee.Scene; // 场景
  gui: dat.GUI; // dat.gui
  camera: THREE.PerspectiveCamera; // 相机
}
