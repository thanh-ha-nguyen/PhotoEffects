import React from "react";
import { Dimensions, type ViewProps } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

/**
 * Props for the PanZoomView component.
 *
 * @property {number} [minScale=0.5] - The minimum zoom level allowed.
 * @property {number} [maxScale=5] - The maximum zoom level allowed.
 */
interface PanZoomViewProps extends ViewProps {
  /**
   * The minimum zoom level allowed.
   * @default 0.5
   */
  minScale?: number;
  /**
   * The maximum zoom level allowed.
   * @default 5
   */
  maxScale?: number;
}

const PanZoomView: React.FC<React.PropsWithChildren<PanZoomViewProps>> = ({
  minScale = 0.5,
  maxScale = 5,
  children,
  onLayout,
  ...props
}) => {
  // Get screen dimensions to calculate boundaries relative to the viewport
  const { width: sw, height: sh } = Dimensions.get("window");

  // --- SHARED VALUES (State management) ---
  // Store the dimensions of the container to calculate focal points and boundaries
  const w = useSharedValue(0);
  const h = useSharedValue(0);

  // Store the current scale and translation values
  const s = useSharedValue(1);
  const _s = useSharedValue(1);

  // Store the current position (X and Y)
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const _x = useSharedValue(x.value);
  const _y = useSharedValue(y.value);

  // --- NEW VARIABLES (Proposed) ---
  // Separate translation components to avoid conflicts
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const zx = useSharedValue(0);
  const zy = useSharedValue(0);

  // Helper function to check boundaries and spring back
  const checkBounds = () => {
    "worklet";

    // Use _s.value (committed scale) to calculate bounds based on the target size
    const cw = w.value * _s.value;
    const ch = h.value * _s.value;

    // Calculate overflow limits
    // Compare scaled content size (cw/ch) with Screen Size, not Content Size (w/h)
    // This allows panning when the image is larger than the screen
    const maxX = Math.max(0, (cw - sw) / 2);
    const maxY = Math.max(0, (ch - sh) / 2);

    // Calculate final proposed position based on all components
    const currentX = _x.value + tx.value + zx.value;
    const currentY = _y.value + ty.value + zy.value;

    // Spring back if out of bounds
    const targetX = Math.min(Math.max(currentX, -maxX), maxX);
    const targetY = Math.min(Math.max(currentY, -maxY), maxY);

    // Update state to current position before animating to target
    // This prevents the image from jumping back to 0 when tx/ty are reset
    _x.value = currentX;
    _y.value = currentY;

    // Reset temporary gesture values
    tx.value = 0;
    ty.value = 0;
    zx.value = 0;
    zy.value = 0;

    // Commit values
    _x.value = withSpring(targetX);
    _y.value = withSpring(targetY);
  };

  // --- GESTURES LOGIC ---

  // 1. PINCH GESTURE (Zoom in/out at a specific point)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      // Calculate new scale based on original scale * gesture scale
      s.value = _s.value * e.scale;

      // Calculate focal point shift relative to the view center
      const centerX = w.value / 2;
      const centerY = h.value / 2;

      // Correct the focal point by removing the active pan (tx,ty) and committed pan (_x,_y)
      // This ensures we zoom into the correct point on the image
      zx.value = (1 - e.scale) * (e.focalX - tx.value - centerX - _x.value);
      zy.value = (1 - e.scale) * (e.focalY - ty.value - centerY - _y.value);
    })
    .onEnd(() => {
      // Clamp scale to defined minimum and maximum boundaries
      if (s.value < minScale) {
        s.value = withSpring(minScale);
        _s.value = minScale;
      } else if (s.value > maxScale) {
        s.value = withSpring(maxScale);
        _s.value = maxScale;
      } else {
        _s.value = s.value;
      }
      checkBounds();
    });

  // 2. PAN GESTURE (Move image around)
  const panGesture = Gesture.Pan()
    .averageTouches(true) // [NEW CODE] Smooths movement
    .onUpdate((e) => {
      // Move based on finger movement
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd(() => {
      checkBounds();
    });

  // 3. DOUBLE TAP GESTURE (Reset image position)
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      // Animate back to original position and size
      s.value = withSpring(1);
      _s.value = 1;
      _x.value = withSpring(0);
      _y.value = withSpring(0);

      // Reset all position components
      tx.value = 0;
      ty.value = 0;
      zx.value = 0;
      zy.value = 0;
    });

  // --- COMBINE GESTURES ---
  // Use Simultaneous to allow Pan to start immediately without waiting for Double Tap to fail
  const composedGesture = Gesture.Simultaneous(
    doubleTapGesture,
    panGesture,
    pinchGesture,
  );

  // --- ANIMATED STYLES ---
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Combine all translation components
      { translateX: _x.value + tx.value + zx.value },
      { translateY: _y.value + ty.value + zy.value },
      { scale: s.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        {...props}
        onLayout={(e) => {
          w.value = e.nativeEvent.layout.width;
          h.value = e.nativeEvent.layout.height;
          onLayout?.(e);
        }}
      >
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default PanZoomView;
