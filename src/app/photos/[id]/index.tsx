import PanZoomView from "@/components/PanZoomView";
import withPerformanceModeSettings from "@/components/withPerformanceModeSettings";
import {
  ImageEffect,
  ImageEffectTypes,
  OpenCVImage,
} from "@/modules/expo-opencv";
import { getPhotoById, savePhotoEffectsByPhotoId } from "@/persistence/photos";
import styled from "@/utils/styled";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type PhotoEntityWithEffects = typeof getPhotoById extends (
  ...args: any
) => Promise<infer R>
  ? R
  : never;

type ImageEffectWithId = Exclude<ImageEffect, ImageEffectTypes> & {
  id?: number;
};

const ImageEditorScreen: React.FC = () => {
  const [headerTitle, setHeaderTitle] = useState("Loading...");
  const [photo, setPhoto] = useState<PhotoEntityWithEffects | undefined>();
  const [effects, setEffects] = useState<ImageEffectWithId[]>([]);
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    async function loadPhotoFromDb() {
      const photo = await getPhotoById(Number(id));
      setHeaderTitle(photo ? `Photo ${photo.id}` : "Photo not found");
      setPhoto(photo);
      setEffects(extractImageEffects(photo));
    }
    loadPhotoFromDb();
  }, [id]);

  const addEffect = (effectName: ImageEffectTypes) =>
    async function handleAddEffect() {
      if (!photo) return;

      const newEffects = effects.concat({ name: effectName });
      await savePhotoEffectsByPhotoId(
        photo.id,
        newEffects.map((effect, index) => ({
          order: index,
          id: effect.id,
          effectName: effect.name,
          effectOptions: JSON.stringify(effect.options),
        })),
      );
      setEffects(newEffects);
    };

  return (
    <StyledGestureHandlerRootView style={StyleSheet.absoluteFill}>
      <Stack.Screen options={{ headerTitle }} />
      {photo && (
        <PanZoomView width={photo.width} height={photo.height}>
          <OpenCVImage
            source={{ uri: photo.uri }}
            effects={effects}
            contentFit="contain"
            style={StyleSheet.absoluteFill}
          />
        </PanZoomView>
      )}
      <BottomButtonsContainer>
        <TouchableOpacity onPress={addEffect("grayscale")}>
          <Button>
            <ButtonText>Grayscale</ButtonText>
          </Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={addEffect("blur")}>
          <Button>
            <ButtonText>Blur</ButtonText>
          </Button>
        </TouchableOpacity>
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
    borderRadius: 5,
    opacity: 0.8,
    padding: 10,
  },
});

const ButtonText = styled(Text)({
  root: {
    fontFamily: "Inter Regular",
    fontSize: 18,
    fontWeight: "bold",
  },
});

function extractImageEffects(
  photo: PhotoEntityWithEffects,
): ImageEffectWithId[] {
  return (
    photo?.effects.map((effect) => ({
      id: effect.id,
      name: effect.effectName as ImageEffectTypes,
      options: effect.effectOptions
        ? JSON.parse(effect.effectOptions)
        : undefined,
    })) || []
  );
}
