import type { ModifierConfig } from "@expo/ui/swift-ui/modifiers";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

// prettier-ignore
export type ModifierGenerator = (style: ViewStyle | ImageStyle | TextStyle) => ModifierConfig[];

// prettier-ignore
export type ModifierGeneratorMiddleware = (next: ModifierGenerator) => ModifierGenerator;
