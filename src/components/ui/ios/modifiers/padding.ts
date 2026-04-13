import { padding } from "@expo/ui/swift-ui/modifiers";
import { ModifierGeneratorMiddleware } from "./types";

const modifier: ModifierGeneratorMiddleware = (next) => (style) => {
  const modifiers = next(style);
  if (style.padding !== undefined) {
    modifiers.push(padding({ all: Number(style.padding) }));
  }
  if (style.paddingHorizontal !== undefined) {
    modifiers.push(padding({ horizontal: Number(style.paddingHorizontal) }));
  }
  if (style.paddingVertical !== undefined) {
    modifiers.push(padding({ vertical: Number(style.paddingVertical) }));
  }
  return modifiers;
};

export default modifier;
