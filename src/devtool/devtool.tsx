import { useKeyPress } from "ahooks";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { HubType, IModelLoaded, hub } from "./hub";
import { memo, useEffect } from "react";

/**
 * 三维模型调试工具
 */
export const Devtool = memo(() => {
  useEffect(() => {
    const handler = (data: IModelLoaded) => {
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
    };

    // 监听模型加载事件
    hub.on(HubType.ModelLoaded, handler);
    return () => {
      hub.off(HubType.ModelLoaded, handler);
    };
  }, []);

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
});
