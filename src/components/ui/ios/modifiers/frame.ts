import { frame } from "@expo/ui/swift-ui/modifiers";
import { ModifierGeneratorMiddleware } from "./types";

const modifier: ModifierGeneratorMiddleware = (next) => (style) => {
  const modifiers = next(style);
  if (style.width !== undefined || style.height !== undefined) {
    modifiers.push(
      frame({
        width: typeof style.width === "number" ? style.width : undefined,
        height: typeof style.height === "number" ? style.height : undefined,
      }),
    );
  }
  return modifiers;
};

export default modifier;
