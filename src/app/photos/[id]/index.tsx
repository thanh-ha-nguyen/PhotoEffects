import PanZoomView from "@/components/PanZoomView";
import withPerformanceModeSettings from "@/components/withPerformanceModeSettings";
import {
  ImageEffect,
  ImageEffectTypes,
  OpenCVImage,
} from "@/modules/expo-opencv";
import { PhotoEffectEntity } from "@/persistence/schema";
import usePhotoActiveRecord from "@/states/photoActiveRecord";
import styled from "@/utils/styled";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ImageEditorScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const photo = usePhotoActiveRecord((state) => state.photo);
  const effects = usePhotoActiveRecord((state) => state.photoEffects);
  const isLoading = usePhotoActiveRecord((state) => state.isLoading);
  const loadPhotoById = usePhotoActiveRecord((state) => state.loadPhotoById);
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    loadPhotoById(Number(id));
  }, [id, loadPhotoById]);

  return (
    <StyledGestureHandlerRootView style={StyleSheet.absoluteFill}>
      <Stack.Screen
        options={{
          headerTitle: isLoading ? "Loading..." : `Photo ${photo?.id}`,
        }}
      />
      {photo && (
        <PanZoomView width={photo.width} height={photo.height}>
          <OpenCVImage
            source={{ uri: photo.uri }}
            effects={toImageEffects(effects)}
            contentFit="contain"
            style={StyleSheet.absoluteFill}
          />
        </PanZoomView>
      )}
      <BottomButtonsContainer style={{ bottom: insets.bottom }}>
        <Link href={`/photos/${id}/effects`} asChild>
          <TouchableOpacity activeOpacity={0.8}>
            <Button>
              <Ionicons
                name="color-palette"
                size={30}
                color={theme.colors.primary}
              />
            </Button>
          </TouchableOpacity>
        </Link>
      </BottomButtonsContainer>
    </StyledGestureHandlerRootView>
  );
};

export default withPerformanceModeSettings(ImageEditorScreen);

const StyledGestureHandlerRootView = styled(GestureHandlerRootView)({
  root: {
    flex: 1,
  },
});

const BottomButtonsContainer = styled(View)({
  root: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    flexDirection: "row",
    gap: 20,
  },
});

const Button = styled(View)({
  root: {
    backgroundColor: "white",
    borderRadius: 9999,
    opacity: 0.8,
    padding: 10,
  },
});

function toImageEffects(effects: PhotoEffectEntity[] | null): ImageEffect[] {
  return (
    (effects || []).map((effect) => ({
      name: effect.effectName as ImageEffectTypes,
      options: effect.effectOptions
        ? JSON.parse(effect.effectOptions)
        : undefined,
    })) || []
  );
}
