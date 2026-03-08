import styled from "@/utils/styled";
import Slider, { type SliderProps } from "@react-native-community/slider";
import type { ListItemSubtitleProps, ListItemTitleProps } from "@rneui/base";
import { ListItem, type ListItemProps } from "@rneui/themed";
import React from "react";
import { type TextProps, View, type ViewStyle } from "react-native";

export interface ListItemSliderInputProps extends ListItemProps {
  helperText?: string;
  helperTextProps?: ListItemSubtitleProps;
  inputProps?: Omit<SliderProps, "ref">;
  inputStyle?: ViewStyle;
  label?: string;
  labelProps?: ListItemTitleProps;
  showValueLabel?: boolean;
  valueLabelFormat?: (value: number) => string;
  valueLabelProps?: TextProps;
}

const ListItemInput: React.FC<ListItemSliderInputProps> = ({
  helperText,
  helperTextProps,
  inputProps,
  inputStyle,
  label,
  labelProps,
  showValueLabel,
  valueLabelFormat = (value: number) => String(value),
  valueLabelProps,
  ...props
}) => (
  <ListItem {...props}>
    <ListItemContent>
      <Container></Container>
      {label && <ListItem.Title {...labelProps}>{label}</ListItem.Title>}
      <StyledSlider {...inputProps} />
      {helperText && (
        <ListItem.Subtitle {...helperTextProps}>{helperText}</ListItem.Subtitle>
      )}
    </ListItemContent>
  </ListItem>
);

export default ListItemInput;

const ListItemContent = styled(ListItem.Content)({
  root: {
    alignItems: "stretch",
  },
});

const Container = styled(View)({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const StyledSlider = styled(Slider)({
  root: {
    flexGrow: 1,
  },
});
