import React from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { HubType, hub } from "./hub";
import { memo } from "react";
import { useGlobalStore } from "./hooks/useGlobalStore";
import { Shortcut } from "./comps/Shortcuts";

/**
 * 监听模型加载事件: 初始化通用服务
 */
hub.on(HubType.ModelLoaded, function init(data) {
  const { scene, camera, renderer } = data;

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  // 创建渲染循环
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});

/**
 * 三维模型调试工具
 */
export const Devtool = memo(() => {
  return (
    <React.Fragment>
      <Layout></Layout>
      <Shortcut></Shortcut>
    </React.Fragment>
  );
});

/**
 * 布局
 */
function Layout() {
  const global = useGlobalStore();
  if (global.dev === false) return null;
  return (
    <div
      id="yythree-devtool"
      className="h-full select-none fixed left-0 top-0 w-[450px] shadow-lg z-[80000] flex flex-col overflow-hidden text-[12px] bg-gray-100"
    >
      <div className="flex-1 bg-white flex flex-col">
        <div className="bg-gray-300 shrink-0 p-1 px-2 flex items-center h-[30px]">
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
}
