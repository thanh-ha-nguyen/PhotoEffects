import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import decoration from "./modifiers/decoration";
import effects from "./modifiers/effects";
import frame from "./modifiers/frame";
import padding from "./modifiers/padding";
import type {
  ModifierGenerator,
  ModifierGeneratorMiddleware,
} from "./modifiers/types";

const init: ModifierGenerator = () => [];

const compose = (...fns: ModifierGeneratorMiddleware[]) =>
  fns.reduce((generator, next) => next(generator), init);

export default function mapStyleToModifiers(
  style?: ViewStyle | ImageStyle | TextStyle,
) {
  if (!style) {
    return [];
  }
  return compose(effects, decoration, padding, frame)(style);
}
