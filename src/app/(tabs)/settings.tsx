import ListItemSwitchInput from "@/components/ListItemSwitchInput";
import { Group, List, Section } from "@/components/ui";
import useSettings from "@/states/settings";
import styled from "@/utils/styled";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsTab: React.FC = () => {
  const performanceMode = useSettings((state) => state.performanceMode);
  const setPerformanceMode = useSettings((state) => state.setPerformanceMode);

  return (
    <StyledSafeAreaView>
      <List>
        <Section title="General">
          <Group>
            <ListItemSwitchInput
              inputProps={{
                value: performanceMode === "performance",
                onValueChange: (value) => {
                  setPerformanceMode(
                    value ? "performance" : "resource-intensive",
                  );
                },
              }}
              label={"Performance"}
              helperText="Turn off performance mode to reduce memory consumed."
            />
          </Group>
        </Section>
      </List>
    </StyledSafeAreaView>
  );
};

export default SettingsTab;

const StyledSafeAreaView = styled(SafeAreaView)({
  root: {
    flex: 1,
    backgroundColor: "#F2F2F7", // Default iOS light gray background
  },
});
