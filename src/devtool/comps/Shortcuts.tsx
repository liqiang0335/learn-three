import { useGlobalStore } from "../hooks/useGlobalStore";
import { useKeyPress } from "ahooks";

export function Shortcut() {
  const global = useGlobalStore();

  // 开启/关闭调试工具
  useKeyPress("ctrl.alt.0", () => {
    console.log("⭕️ [2024-04-22 17:47:23]", "");
    global.dispatch({ dev: !global.dev });
  });

  return <div className="fixed"></div>;
}
