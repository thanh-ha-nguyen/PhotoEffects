import styled from "@/utils/styled";
import { ListItem, type ListItemProps } from "@rneui/themed";
import { forwardRef } from "react";
import {
  Text,
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

interface DeleteableListItemProps extends ListItemProps {
  deleteButtonLabel?: string;
  deleteButtonStyle?: TouchableOpacityProps["style"];
  onDelete?: () => void;
}

const DeleteableListItem = forwardRef(function DeleteableListItem(
  {
    deleteButtonLabel = "Delete",
    deleteButtonStyle,
    children,
    onDelete = () => void 0,
    ...props
  }: DeleteableListItemProps,
  ref: React.ForwardedRef<ListItemProps>,
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
    width: translateX.value > 0 ? translateX.value : "auto",
  }));
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      if (translateX.value < 0) {
        translateX.value = 0;
      }
    })
    .onEnd((e) => {
      if (e.translationX < buttonWidth.value! * 0.6) {
        translateX.value = withTiming(0, { duration: 300 });
        return;
      }
      if (e.velocityX > width.value! / 2 && e.translationX > width.value! / 2) {
        translateX.value = withTiming(width.value! + 1, {
          duration: 300,
        });
        opacity.value = withTiming(0, { duration: 300 }, () =>
          scheduleOnRN(onDelete),
        );
      } else {
        translateX.value = withTiming(buttonWidth.value!, {
          duration: 300,
        });
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <ListItemView
        onLayout={(e) => {
          if (width.value !== null) return;
          width.value = e.nativeEvent.layout.width;
        }}
      >
        <TouchableOpacity onPress={onDelete}>
          <DeleteButton
            style={[deleteButtonStyle, animatedButtonStyle]}
            onLayout={(e) => {
              if (buttonWidth.value !== null) return;
              buttonWidth.value = e.nativeEvent.layout.width;
            }}
          >
            <DangerText>{deleteButtonLabel}</DangerText>
          </DeleteButton>
        </TouchableOpacity>
        <Animated.View style={animatedStyle}>
          <ListItem ref={ref} {...props}>
            {children}
          </ListItem>
        </Animated.View>
      </ListItemView>
    </GestureDetector>
  );
});

export default DeleteableListItem;

const DeleteButton = styled(Animated.View)((theme) => ({
  root: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
    paddingHorizontal: 12,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
}));

const DangerText = styled(Text)((theme) => ({
  root: {
    color: theme.colors.white,
    padding: 8,
    textAlign: "center",
  },
}));

const ListItemView = styled(View)({
  root: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
});
