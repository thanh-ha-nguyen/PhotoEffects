import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface BaseProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Host component: The root container for the UI layout.
 * On Web/Fallback, this is a standard View with flex: 1.
 */
export const Host: React.FC<BaseProps> = ({ children, style }) => (
  <View style={[{ flex: 1 }, style]}>{children}</View>
);
