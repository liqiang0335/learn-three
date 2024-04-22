import { useEffect } from "react";
import { renderModel } from "./renderer/dam";
import { Devtool } from "./devtool/devtool";
import { HubType, IModelLoaded, hub } from "./devtool/hub";

/**
 * App
 */
export default function App() {
  useEffect(() => {
    renderModel("contianer").then((data) => {
      const { scene, camera, renderer } = data;
      const payload: IModelLoaded = { scene, camera, renderer };
      hub.emit(HubType.ModelLoaded, payload);
    });
  }, []);

  return (
    <div>
      <canvas id="contianer" className="w-[1200px] h-[600px] bg-gray-100"></canvas>
      <Devtool></Devtool>
    </div>
  );
}
