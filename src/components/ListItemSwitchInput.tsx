import { HStack, List, Section, Switch, Text, VStack } from "@/components/ui";
import React from "react";

export interface ListItemSwitchInputProps {
  helperText?: string;
  inputProps?: {
    value: boolean;
    onValueChange: (value: boolean) => void;
  };
  label?: string;
}

const ListItemSwitchInput: React.FC<ListItemSwitchInputProps> = ({
  helperText,
  inputProps,
  label,
}) => (
  <VStack>
    <HStack
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
      }}
    >
      {label && <Text style={{ fontSize: 17, fontWeight: "500" }}>{label}</Text>}
      {inputProps && (
        <Switch
          value={inputProps.value}
          onValueChange={inputProps.onValueChange}
        />
      )}
    </HStack>
    {helperText && (
      <Text style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
        {helperText}
      </Text>
    )}
  </VStack>
);

export default ListItemSwitchInput;
