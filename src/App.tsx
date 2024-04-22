import { renderModel } from "./renderer/dam";
import { Devtool } from "./devtool/devtool";
import { HubType, IModelLoaded, hub } from "./devtool/hub";

/**
 * App
 */
export default function App() {
  return (
    <div>
      <canvas id="contianer" className="w-[1200px] h-[600px] bg-gray-100"></canvas>
      <Devtool></Devtool>
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const el = document.getElementById("contianer")! as HTMLCanvasElement;
    renderModel(el).then((data) => {
      const { scene, camera, renderer } = data;
      const payload: IModelLoaded = { scene, camera, renderer };
      hub.emit(HubType.ModelLoaded, payload);
    });
  }, 10);
});
