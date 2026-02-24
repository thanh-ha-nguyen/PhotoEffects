import { isResourceIntensiveMode } from "@/persistence/settings";
import { useIsFocused } from "@react-navigation/native";
import React from "react";

const withPerformanceModeSettings = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return function PerformanceModeHOC(props: P) {
    const isFocused = useIsFocused();
    if (!isFocused && isResourceIntensiveMode()) {
      // Don't render the component when it's not focused to save resources
      return null;
    }
    return <Component {...props} />;
  };
};

export default withPerformanceModeSettings;
