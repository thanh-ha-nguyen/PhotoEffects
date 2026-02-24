import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

const styled =
  <P extends { style?: StyleProp<any> }>(Component: React.ComponentType<P>) =>
  <T extends { root?: ViewStyle | ImageStyle | TextStyle }>(styles: T) => {
    const styleSheet = StyleSheet.create(styles);
    return function StyledComponent({ style: overridenStyle, ...props }: P) {
      return (
        <Component
          style={[styleSheet.root, overridenStyle]}
          {...(props as P)}
        />
      );
    };
  };

export default styled;
