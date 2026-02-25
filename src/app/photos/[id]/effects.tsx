import { ImageEffects } from "@/modules/expo-opencv";
import usePhotoActiveRecord from "@/states/photoActiveRecord";
import styled from "@/utils/styled";
import { ListItem } from "@rneui/themed";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
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
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <Stack.Screen
        options={{ headerTitle: isLoading ? "Loading..." : "Effects" }}
      />
      <StyledScrollView style={{ marginTop: -insets.top }}>
        <HeaderText>In-use</HeaderText>
        {effects && effects.length > 0 ? (
          <List>
            {effects?.map((effect, index) => (
              <RemovableListItemView key={effect.id || -index}>
                <DeleteButton onPress={() => removeEffect(effect.id)}>
                  <DangerText>Delete</DangerText>
                </DeleteButton>
                <ListItem style={{ flex: 1 }}>
                  <ListItem.Content>
                    <ListItem.Title>{effect.effectName}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              </RemovableListItemView>
            ))}
          </List>
        ) : (
          <EmptyText>No effects applied to this photo yet.</EmptyText>
        )}
        <HeaderText>Available</HeaderText>
        <List>
          {ImageEffects.map((effect) => (
            <ListItem key={effect} onPress={() => addEffect(effect)}>
              <ListItem.Content>
                <ListItem.Title>{effect}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </List>
      </StyledScrollView>
    </SafeAreaView>
  );
};

export default ImageEffectsEditorScreen;

const StyledScrollView = styled(ScrollView)({
  root: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
  },
});

const HeaderText = styled(Text)({
  root: {
    fontFamily: "Inter Regular",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

const EmptyText = styled(Text)({
  root: {
    fontFamily: "Inter Regular",
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
});

const DeleteButton = styled(TouchableOpacity)((theme) => ({
  root: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
}));

const DangerText = styled(Text)((theme) => ({
  root: {
    color: theme.colors.white,
    padding: 8,
  },
}));

const List = styled(View)({
  root: {
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    flex: 1,
    flexDirection: "column",
    gap: 1,
    marginBottom: 24,
    overflow: "hidden",
  },
});

const RemovableListItemView = styled(Animated.View)({
  root: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
  },
});
