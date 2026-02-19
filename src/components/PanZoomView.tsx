import React from "react";
import { Dimensions, ViewProps } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export interface PanZoomViewProps extends ViewProps {
  height: number;
  width: number;
}

const PanZoomView: React.FC<React.PropsWithChildren<PanZoomViewProps>> = ({
  children,
  width,
  height,
}) => {
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const viewWidth = useSharedValue(width);
  const viewHeight = useSharedValue(height);
  const centerX = useSharedValue(windowWidth / 2);
  const centerY = useSharedValue(windowHeight / 2);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const scale = useSharedValue(1);
  const scaleBase = useSharedValue(1);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      focalX.value = e.focalX;
      focalY.value = e.focalY;
    })
    .onUpdate((e) => {
      scale.value = e.scale;
    });

  const pan = Gesture.Pan()
    .onStart(() => {
      originX.value = translateX.value;
      originY.value = translateY.value;
    })
    .onUpdate(({ translationX, translationY }) => {
      translateX.value = originX.value + translationX;
      translateY.value = originY.value + translationY;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    height: viewHeight.value,
    width: viewWidth.value,
    transform: [
      { translateX: -(centerX.value - focalX.value) },
      { translateY: -(centerY.value - focalY.value) },
      { scale: scale.value },
      { translateX: centerX.value - focalX.value },
      { translateY: centerY.value - focalY.value },
      { scale: scaleBase.value },
      { translateX: translateX.value - viewWidth.value / 2 },
      { translateY: translateY.value - viewHeight.value / 2 },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default PanZoomView;
