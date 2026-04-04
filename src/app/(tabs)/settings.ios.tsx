import useSettings from "@/states/settings";
import { Host, List, Section, Text, Toggle, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import React from "react";

const SettingsTab: React.FC = () => {
  const performanceMode = useSettings((state) => state.performanceMode);
  const setPerformanceMode = useSettings((state) => state.setPerformanceMode);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <Section>
          <List>
            <Toggle
              label="Performance Mode"
              isOn={performanceMode === "performance"}
              onIsOnChange={(value) => {
                setPerformanceMode(
                  value ? "performance" : "resource-intensive",
                );
              }}
            />
            <Text
              modifiers={[
                foregroundStyle({ type: "hierarchical", style: "secondary" }),
                font({ size: 14 }),
              ]}
            >
              Turn off performance mode to reduce memory consumed.
            </Text>
          </List>
        </Section>
      </VStack>
    </Host>
  );
};

export default SettingsTab;
