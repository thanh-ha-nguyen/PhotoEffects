import DeleteableListItem from "@/components/DeleteableListItem";
import { Group, List, Section, Text, VStack } from "@/components/ui";
import { ImageEffects } from "@/modules/expo-opencv";
import usePhotoActiveRecord from "@/states/photoActiveRecord";
import styled from "@/utils/styled";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ImageEffectsEditorScreen = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const effects = usePhotoActiveRecord((state) => state.photoEffects);
  const isLoading = usePhotoActiveRecord((state) => state.isLoading);
  const loadPhotoById = usePhotoActiveRecord((state) => state.loadPhotoById);
  const addEffect = usePhotoActiveRecord((state) => state.addEffect);
  const removeEffect = usePhotoActiveRecord((state) => state.removeEffect);

  useEffect(() => {
    loadPhotoById(Number(id));
  }, [id, loadPhotoById]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={StyleSheet.absoluteFill}>
        <Stack.Screen
          options={{ headerTitle: isLoading ? "Loading..." : "Effects" }}
        />
        <StyledScrollView style={{ marginTop: -insets.top }}>
          <Section title="In-use">
            {effects && effects.length > 0 ? (
              <Group>
                {effects?.map((effect, index) => (
                  <DeleteableListItem
                    key={effect.id || -index}
                    onDelete={() => removeEffect(effect.id)}
                  >
                    <VStack style={{ paddingVertical: 12 }}>
                      <Text style={{ fontSize: 17 }}>{effect.effectName}</Text>
                    </VStack>
                  </DeleteableListItem>
                ))}
              </Group>
            ) : (
              <EmptyText>No effects applied to this photo yet.</EmptyText>
            )}
          </Section>

          <Section title="Available">
            <Group>
              {ImageEffects.map((effect) => (
                <TouchableOpacity
                  key={effect}
                  onPress={() => addEffect(effect)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: "#ccc",
                  }}
                >
                  <Text style={{ fontSize: 17 }}>{effect}</Text>
                </TouchableOpacity>
              ))}
            </Group>
          </Section>
        </StyledScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ImageEffectsEditorScreen;

const StyledScrollView = styled(ScrollView)({
  root: {
    flex: 1,
    backgroundColor: "#F2F2F7", // Default iOS light gray background
  },
});

const EmptyText = styled(Text)({
  root: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
});
