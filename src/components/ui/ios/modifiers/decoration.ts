import { background, cornerRadius } from "@expo/ui/swift-ui/modifiers";
import { ModifierGeneratorMiddleware } from "./types";

const modifier: ModifierGeneratorMiddleware = (next) => (style) => {
  const modifiers = next(style);
  if (style.backgroundColor) {
    modifiers.push(background(style.backgroundColor));
  }
  if (typeof style.borderRadius === "number") {
    modifiers.push(cornerRadius(style.borderRadius));
  }
  return modifiers;
};

export default modifier;
