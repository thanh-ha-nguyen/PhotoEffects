import { ImageEffects } from "@/modules/expo-opencv";
import usePhotoActiveRecord from "@/states/photoActiveRecord";
import { Button, Host, Label, List, Section, Text } from "@expo/ui/swift-ui";
import { listStyle, refreshable, tag } from "@expo/ui/swift-ui/modifiers";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

const ImageEffectsEditorScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const effects = usePhotoActiveRecord((state) => state.photoEffects);
  const isLoading = usePhotoActiveRecord((state) => state.isLoading);
  const loadPhotoById = usePhotoActiveRecord((state) => state.loadPhotoById);
  const addEffect = usePhotoActiveRecord((state) => state.addEffect);
  const removeEffect = usePhotoActiveRecord((state) => state.removeEffect);

  useEffect(() => {
    loadPhotoById(Number(id));
  }, [id, loadPhotoById]);

  const handleDelete = (ids: number[]) => {
    ids.forEach((id) => removeEffect(id));
  };

  const handleRefresh = async () => {
    loadPhotoById(Number(id));
  };

  return (
    <Host style={{ flex: 1 }}>
      <Stack.Screen
        options={{ headerTitle: isLoading ? "Loading..." : "Effects" }}
      />
      <List modifiers={[listStyle("sidebar"), refreshable(handleRefresh)]}>
        <Section
          title="In-use"
          footer={<Text>Swipe to delete, drag to reorder</Text>}
        >
          <List.ForEach onDelete={handleDelete}>
            {effects?.map((effect) => (
              <Label
                key={effect.id}
                title={effect.effectName}
                systemImage="wand.and.sparkles"
                modifiers={[tag(effect.id)]}
              />
            ))}
          </List.ForEach>
        </Section>

        <Section title="Available">
          {ImageEffects.map((effect) => (
            <Button
              key={effect}
              label={effect}
              systemImage="wand.and.sparkles.inverse"
              onPress={() => addEffect(effect)}
            />
          ))}
        </Section>
      </List>
    </Host>
  );
};

export default ImageEffectsEditorScreen;
