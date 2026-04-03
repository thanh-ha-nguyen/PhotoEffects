import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface BaseProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * HStack: A horizontal stack of components.
 */
export const HStack: React.FC<BaseProps> = ({ children, style }) => (
  <View style={[styles.hStack, style]}>{children}</View>
);

const styles = StyleSheet.create({
  hStack: {
    flexDirection: "row",
    alignItems: "center",
  },
});
