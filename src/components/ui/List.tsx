import React from "react";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface BaseProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const List: React.FC<BaseProps> = ({ children, style }) => (
  <ScrollView style={[styles.list, style]}>{children}</ScrollView>
);

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
