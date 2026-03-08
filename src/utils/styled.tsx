import { useTheme } from "@rneui/themed";
import React from "react";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

type RootStyle = {
  root?: StyleProp<ViewStyle | ImageStyle | TextStyle>;
};

const styled =
  <C extends React.ElementType>(Component: C) =>
  <
    T extends
      | RootStyle
      | ((
          theme: ReturnType<typeof useTheme>["theme"],
          props: React.ComponentProps<C>,
        ) => RootStyle),
  >(
    styles: T,
  ) => {
    const StyledComponent: React.FC<
      React.ComponentProps<C> & {
        style?: StyleProp<ViewStyle | ImageStyle | TextStyle>;
      }
    > = ({ style: overridenStyle, ...props }) => {
      const { theme } = useTheme();
      const computedStyle =
        typeof styles === "function"
          ? styles(theme, props as React.ComponentProps<C>)
          : (styles as RootStyle);
      return (
        <Component
          {...({
            ...props,
            style: [computedStyle?.root || {}, overridenStyle],
          } as React.ComponentProps<C>)}
        />
      );
    };
    StyledComponent.displayName = `Styled(${(Component as any).displayName || (Component as any).name || "Component"})`;
    return StyledComponent;
  };

export default styled;
