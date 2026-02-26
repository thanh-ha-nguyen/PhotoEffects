import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const PanZoomView: React.FC<React.PropsWithChildren> = ({ children }) => {
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const scale = useSharedValue(1);
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

  const zoomAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    transformOrigin: [focalX.value, focalY.value, 1],
  }));

  const panAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={zoomAnimatedStyle}>
        <Animated.View style={panAnimatedStyle}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default PanZoomView;
