import styled from "@/utils/styled";
import type { ListItemSubtitleProps, ListItemTitleProps } from "@rneui/base";
import { ListItem, type ListItemProps } from "@rneui/themed";
import React from "react";
import { Switch, SwitchProps, View } from "react-native";

export interface ListItemSwitchInputProps extends ListItemProps {
  helperText?: string;
  helperTextProps?: ListItemSubtitleProps;
  inputProps?: Omit<SwitchProps, "ref">;
  label?: string;
  labelProps?: ListItemTitleProps;
}

const ListItemSwitchInput: React.FC<ListItemSwitchInputProps> = ({
  helperText,
  helperTextProps,
  inputProps,
  label,
  labelProps,
  ...props
}) => (
  <ListItem {...props}>
    <ListItemContent>
      <StyledView>
        {label && <ListItem.Title {...labelProps}>{label}</ListItem.Title>}
        <StyledSwitch {...inputProps} />
      </StyledView>
      {helperText && (
        <ListItemSubtitle {...helperTextProps}>{helperText}</ListItemSubtitle>
      )}
    </ListItemContent>
  </ListItem>
);

export default ListItemSwitchInput;

const ListItemContent = styled(ListItem.Content)({
  root: {
    alignItems: "stretch",
  },
});

const ListItemSubtitle = styled(ListItem.Subtitle)({
  root: {
    marginTop: 16,
  },
});

const StyledView = styled(View)({
  root: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const StyledSwitch = styled(Switch)({
  root: {
    marginLeft: "auto",
  },
});
