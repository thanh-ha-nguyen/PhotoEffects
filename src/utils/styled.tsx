import { useTheme } from "@rneui/themed";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

const styled =
  <P extends object>(Component: React.ComponentType<P>) =>
  <
    T extends {
      root?:
        | ViewStyle
        | ImageStyle
        | TextStyle
        | ((
            theme?: Record<string, any>,
            props?: P,
          ) => ViewStyle | ImageStyle | TextStyle);
    },
  >(
    styles: T,
  ) => {
    return function StyledComponent({
      style: overridenStyle,
      ...props
    }: P & { style?: StyleProp<ViewStyle | ImageStyle | TextStyle> }) {
      const theme = useTheme();
      const computedStyle =
        typeof styles.root === "function"
          ? styles.root(theme, props as P)
          : styles.root;
      return (
        <Component style={[computedStyle, overridenStyle]} {...(props as P)} />
      );
    };
  };

export default styled;
