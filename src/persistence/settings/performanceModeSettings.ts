type PerformanceMode = "resource-intensive" | "performance";

export function setPerformanceMode(mode: PerformanceMode) {
  localStorage.setItem("performanceMode", mode);
}

export function getPerformanceMode(): PerformanceMode {
  return (
    (localStorage.getItem("performanceMode") as PerformanceMode) ||
    "performance"
  );
}

export function togglePerformanceMode() {
  const currentMode = getPerformanceMode();
  const newMode =
    currentMode === "performance" ? "resource-intensive" : "performance";
  setPerformanceMode(newMode);
}

export function isResourceIntensiveMode(): boolean {
  return getPerformanceMode() === "resource-intensive";
}

export function isPerformanceMode(): boolean {
  return getPerformanceMode() === "performance";
}
