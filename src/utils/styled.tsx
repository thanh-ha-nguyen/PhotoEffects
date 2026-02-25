import { useTheme } from "@rneui/themed";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

type RootStyle = {
  root?: StyleProp<ViewStyle | ImageStyle | TextStyle>;
};

const styled =
  <P extends object>(Component: React.ComponentType<P>) =>
  <
    T extends
      | RootStyle
      | ((theme: ReturnType<typeof useTheme>["theme"], props?: P) => RootStyle),
  >(
    styles: T,
  ) => {
    return function StyledComponent({
      style: overridenStyle,
      ...props
    }: P & { style?: StyleProp<ViewStyle | ImageStyle | TextStyle> }) {
      const { theme } = useTheme();
      const computedStyle =
        typeof styles === "function"
          ? styles(theme, props as P)
          : (styles as RootStyle);
      return (
        <Component
          style={[computedStyle?.root || {}, overridenStyle]}
          {...(props as P)}
        />
      );
    };
  };

export default styled;
