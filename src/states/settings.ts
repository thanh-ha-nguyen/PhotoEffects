import {
  getPerformanceMode,
  setPerformanceMode,
  type PerformanceMode,
} from "@/persistence/settings";
import "expo-sqlite/localStorage/install";
import { create } from "zustand";

export interface SettingsState {
  performanceMode: PerformanceMode;
  setPerformanceMode: (value: PerformanceMode) => void;
}

const useSettings = create<SettingsState>()((set) => ({
  performanceMode: getPerformanceMode() || "performance",
  setPerformanceMode: (value: PerformanceMode) => {
    setPerformanceMode(value);
    set({ performanceMode: value });
  },
}));

export default useSettings;
