import { opacity, shadow } from "@expo/ui/swift-ui/modifiers";
import { ModifierGeneratorMiddleware } from "./types";

const effects: ModifierGeneratorMiddleware = (next) => (style) => {
  const modifiers = next(style);
  if (style.opacity !== undefined) {
    modifiers.push(opacity(Number(style.opacity)));
  }
  if (style.shadowColor) {
    modifiers.push(
      shadow({
        color: style.shadowColor as string,
        radius: style.shadowRadius || 5,
        x: style.shadowOffset?.width || 0,
        y: style.shadowOffset?.height || 0,
      }),
    );
  }
  return modifiers;
};

export default effects;
