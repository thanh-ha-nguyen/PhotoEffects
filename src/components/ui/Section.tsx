import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface SectionProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  title?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, style }) => (
  <View style={[styles.section, style]}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    {children}
  </View>
);

export default Section;

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
});
