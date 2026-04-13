import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface BaseProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * ZStack: A stack that overlays components on top of each other.
 */
const ZStack: React.FC<BaseProps> = ({ children, style }) => (
  <View style={[styles.zStack, style]}>{children}</View>
);

export default ZStack;

const styles = StyleSheet.create({
  zStack: {
    position: "relative",
  },
});
