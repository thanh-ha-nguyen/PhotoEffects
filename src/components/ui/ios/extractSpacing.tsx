import { StyleSheet } from "react-native";

/**
 * Utility to extract spacing from React Native styles for SwiftUI components.
 */
const extractSpacing = (style: any, type: "horizontal" | "vertical") => {
  if (!style) return undefined;
  const flattened = StyleSheet.flatten(style);
  if (type === "horizontal") {
    return flattened.columnGap ?? flattened.gap;
  }
  return flattened.rowGap ?? flattened.gap;
};

export default extractSpacing;
