import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface BaseProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * VStack: A vertical stack of components.
 */
const VStack: React.FC<BaseProps> = ({ children, style }) => (
  <View style={[styles.vStack, style]}>{children}</View>
);

export default VStack;

const styles = StyleSheet.create({
  vStack: {
    flexDirection: "column",
  },
});
