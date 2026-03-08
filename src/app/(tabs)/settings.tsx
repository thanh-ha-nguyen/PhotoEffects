import ListItemSwitchInput from "@/components/ListItemSwitchInput";
import useSettings from "@/states/settings";
import styled from "@/utils/styled";
import { ListItem } from "@rneui/themed";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsTab: React.FC = () => {
  const performanceMode = useSettings((state) => state.performanceMode);
  const setPerformanceMode = useSettings((state) => state.setPerformanceMode);

  return (
    <StyledSafeAreaView>
      <ScrollView>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>General</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <Container>
          <ListItemSwitchInput
            inputProps={{
              value: performanceMode === "performance",
              onValueChange: (value) => {
                setPerformanceMode(
                  value ? "performance" : "resource-intensive",
                );
              },
            }}
            label={"Performace"}
            helperText="Turn off performance mode to reduce memory consumed."
          />
        </Container>
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default SettingsTab;

const Container = styled(View)((theme) => ({
  root: {
    backgroundColor: theme.colors.white,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 4,
    padding: 8,
    overflow: "hidden",
  },
}));

const StyledSafeAreaView = styled(SafeAreaView)((theme) => ({
  root: {
    flex: 1,
    padding: 8,
    backgroundColor: theme.colors.background,
  },
}));
