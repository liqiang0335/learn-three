import { create } from "zustand";
import { persist } from "zustand/middleware";

type AddDispatch<T> = {
  dispatch: (data: {
    [key in keyof T]?: T[key];
  }) => void;
} & T;

type GlobalStore = {
  dev: boolean; // 是否开发模式
};

export const useGlobalStore = create<AddDispatch<GlobalStore>>()(
  persist(
    (set, get) => ({
      dev: true,
      dispatch: (data) => set(data),
    }),
    { name: "global-store" },
  ),
);
