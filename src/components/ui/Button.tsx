import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

/**
 * Button component: A standard interactive button.
 */
const Button: React.FC<ButtonProps> = ({ onPress, children, style }) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <View style={styles.button}>
      <Text style={styles.buttonText}>{children}</Text>
    </View>
  </TouchableOpacity>
);

export default Button;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
