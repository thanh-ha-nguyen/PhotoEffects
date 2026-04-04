import PanZoomView from "@/components/PanZoomView";
import withPerformanceModeSettings from "@/components/withPerformanceModeSettings";
import {
  ImageEffect,
  ImageEffectTypes,
  OpenCVImage,
} from "@/modules/expo-opencv";
import { deletePhotoById } from "@/persistence/photos";
import { PhotoEffectEntity } from "@/persistence/schema";
import usePhotoActiveRecord from "@/states/photoActiveRecord";
import styled from "@/utils/styled";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

const ImageEditorScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const photo = usePhotoActiveRecord((state) => state.photo);
  const effects = usePhotoActiveRecord((state) => state.photoEffects);
  const isLoading = usePhotoActiveRecord((state) => state.isLoading);
  const loadPhotoById = usePhotoActiveRecord((state) => state.loadPhotoById);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const offscreenViewShotRef = React.useRef<ViewShot>(null);

  const handleShare = async () => {
    if (
      photo &&
      offscreenViewShotRef.current &&
      offscreenViewShotRef.current.capture
    ) {
      try {
        const uri = await offscreenViewShotRef.current.capture();
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }
      } catch (err) {
        Alert.alert("Capture Error Details", String(err));
      }
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deletePhotoById(Number(id));
          router.navigate("/");
        },
      },
    ]);
  };

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
        <View
          style={{ position: "absolute", transform: [{ translateX: -10000 }] }}
          pointerEvents="none"
        >
          <ViewShot
            ref={offscreenViewShotRef}
            options={{ format: "jpg", quality: 1.0 }}
          >
            <View collapsable={false}>
              <OpenCVImage
                source={{ uri: photo.uri }}
                effects={toImageEffects(effects)}
                contentFit="fill"
                style={{
                  width:
                    photo.width *
                    Math.min(1, 2048 / Math.max(photo.width, photo.height)),
                  height:
                    photo.height *
                    Math.min(1, 2048 / Math.max(photo.width, photo.height)),
                }}
              />
            </View>
          </ViewShot>
        </View>
      )}
      {photo && (
        <PanZoomView>
          <OpenCVImage
            source={{ uri: photo.uri }}
            effects={toImageEffects(effects)}
            contentFit="contain"
            style={{
              width: photo.width,
              height: photo.height,
            }}
          />
        </PanZoomView>
      )}
      <FloatingButtonContainer style={{ bottom: insets.bottom }}>
        <Link href={`/photos/${id}/effects`} asChild>
          <TouchableOpacity activeOpacity={0.8}>
            <FloatingButton>
              <Ionicons name="color-palette" size={30} color="royalblue" />
            </FloatingButton>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity activeOpacity={0.8} onPress={handleShare}>
          <FloatingButton>
            <Ionicons name="share-outline" size={30} color="royalblue" />
          </FloatingButton>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={handleDelete}>
          <FloatingButton>
            <Ionicons name="trash" size={30} color="crimson" />
          </FloatingButton>
        </TouchableOpacity>
      </FloatingButtonContainer>
    </StyledGestureHandlerRootView>
  );
};

export default withPerformanceModeSettings(ImageEditorScreen);

const StyledGestureHandlerRootView = styled(GestureHandlerRootView)({
  root: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
});

const FloatingButtonContainer = styled(View)({
  root: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    flexDirection: "row",
    gap: 20,
  },
});

const FloatingButton = styled(View)({
  root: {
    backgroundColor: "white",
    borderRadius: 9999,
    opacity: 0.8,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
