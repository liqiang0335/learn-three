import * as THREE from "three";

type Handler = (...args: any[]) => void;

export interface IModelLoaded {
  camera: THREE.Camera;
  scene: THREE.Scene;
  renderer: THREE.Renderer;
}

export const hub = createEventHub();
export const HubType = {
  ModelLoaded: "ModelLoaded", // 加载完成
};

/**
 * ----------------------------------------
 * 事件总线
 * on 事件监听
 * emit 事件触发
 * off 事件移除
 *    - 不存在处理函数, 则删除事件
 *    - 不存在事件, 则不处理
 * clear 清空事件
 * ----------------------------------------
 */
export function createEventHub() {
  return {
    hub: Object.create(null),
    emit(event: string, data?: any) {
      (this.hub[event] || []).forEach((handler: Handler) => handler(data));
    },
    on(event: string, handler: Handler) {
      if (!this.hub[event]) this.hub[event] = [];
      this.hub[event].push(handler);
    },
    off(event: string, handler: Handler) {
      if (!this.hub[event]) return; // 不存在事件
      // 不存在处理函数, 则删除事件
      if (!handler) {
        delete this.hub[event];
        return;
      }
      const i = (this.hub[event] || []).findIndex((h: Handler) => h === handler);
      if (i > -1) this.hub[event].splice(i, 1);
    },
    clear(key: string) {
      if (key) {
        this.hub[key] = [];
      } else {
        this.hub = Object.create(null);
      }
    },
  };
}
