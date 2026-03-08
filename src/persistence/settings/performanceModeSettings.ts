import "expo-sqlite/localStorage/install";

export type PerformanceMode = "resource-intensive" | "performance";

export function setPerformanceMode(mode: PerformanceMode) {
  localStorage.setItem("performanceMode", mode);
}

export function getPerformanceMode(): PerformanceMode {
  return (
    (localStorage.getItem("performanceMode") as PerformanceMode) ||
    "performance"
  );
}
