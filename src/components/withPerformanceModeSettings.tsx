import useSettings from "@/states/settings";
import { useIsFocused } from "@react-navigation/native";
import React from "react";

const withPerformanceModeSettings = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return function PerformanceModeHOC(props: P) {
    const isFocused = useIsFocused();
    const isPerformanceMode =
      "performance" === useSettings((state) => state.performanceMode);

    if (!isFocused && !isPerformanceMode) {
      // Don't render the component when it's not focused to save resources
      return null;
    }
    return <Component {...props} />;
  };
};

export default withPerformanceModeSettings;
