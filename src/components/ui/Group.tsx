import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface BaseProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Group: React.FC<BaseProps> = ({ children, style }) => (
  <View style={[styles.group, style]}>{children}</View>
);

export default Group;

const styles = StyleSheet.create({
  group: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 8,
    marginVertical: 4,
  },
});
