import { HStack, Text } from "@/components/ui";
import React, { forwardRef } from "react";
import {
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

interface DeleteableListItemProps {
  children?: React.ReactNode;
  deleteButtonLabel?: string;
  deleteButtonStyle?: TouchableOpacityProps["style"];
  onDelete?: () => void;
  style?: TouchableOpacityProps["style"];
}

const DeleteableListItem = forwardRef<View, DeleteableListItemProps>(
  function DeleteableListItem(
    {
      deleteButtonLabel = "Delete",
      deleteButtonStyle,
      children,
      onDelete = () => void 0,
      style,
    },
    ref,
  ) {
    const width = useSharedValue<number | null>(null);
    const buttonWidth = useSharedValue<number | null>(null);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      flex: 1,
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    }));

    const animatedButtonStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      width:
        translateX.value > 0
          ? translateX.value
          : buttonWidth.value !== null
            ? 0
            : "auto",
    }));

    const pan = Gesture.Pan()
      .onUpdate((e) => {
        translateX.value = e.translationX;
        if (translateX.value < 0) {
          translateX.value = 0;
        }
      })
      .onEnd((e) => {
        if (
          buttonWidth.value !== null &&
          e.translationX < buttonWidth.value * 0.6
        ) {
          translateX.value = withTiming(0, { duration: 300 });
          return;
        }

        if (
          width.value !== null &&
          e.velocityX > width.value / 2 &&
          e.translationX > width.value / 2
        ) {
          translateX.value = withTiming(width.value + 1, {
            duration: 300,
          });
          opacity.value = withTiming(0, { duration: 300 }, () =>
            scheduleOnRN(onDelete),
          );
        } else if (buttonWidth.value !== null) {
          translateX.value = withTiming(buttonWidth.value, {
            duration: 300,
          });
        }
      });

    return (
      <GestureDetector gesture={pan}>
        <View
          ref={ref}
          style={[
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "stretch",
              position: "relative",
              minHeight: 60,
            },
            style,
          ]}
          onLayout={(e) => {
            if (width.value !== null) return;
            width.value = e.nativeEvent.layout.width;
          }}
        >
          <TouchableOpacity
            onPress={onDelete}
            style={{ position: "absolute", left: 0, top: 0, bottom: 0 }}
          >
            <Animated.View
              onLayout={(e) => {
                if (buttonWidth.value !== null) return;
                buttonWidth.value = e.nativeEvent.layout.width;
              }}
              style={[
                {
                  backgroundColor: "#FF3B30",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  height: "100%",
                },
                deleteButtonStyle,
                animatedButtonStyle,
              ]}
            >
              <Text
                style={{
                  color: "white",
                  paddingHorizontal: 20,
                  fontWeight: "600",
                }}
              >
                {deleteButtonLabel}
              </Text>
            </Animated.View>
          </TouchableOpacity>

          <Animated.View
            style={[
              {
                flex: 1,
                backgroundColor: "white",
              },
              animatedStyle,
            ]}
          >
            <HStack style={{ flex: 1, paddingHorizontal: 16 }}>
              {children}
            </HStack>
          </Animated.View>
        </View>
      </GestureDetector>
    );
  },
);

export default DeleteableListItem;
