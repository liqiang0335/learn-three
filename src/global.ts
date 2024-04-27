import * as THREE from "three";

interface Global {
  selectedMesh: THREE.Mesh[];
  mainScene?: THREE.Scene;
  model?: THREE.Object3D;
}

/**
 * 全局变量
 */
export const global: Global = {
  selectedMesh: [],
  mainScene: undefined,
  model: undefined,
};
