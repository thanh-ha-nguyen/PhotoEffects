"use client";

import React from "react";
import { StyleSheet, View } from "react-native";

import { OpenCVImageBackgroundProps } from "./ExpoOpenCV.types";
import OpenCVImage from "./OpenCVImage";

export default function OpenCVImageBackground({
  style,
  imageStyle,
  children,
  ...props
}: OpenCVImageBackgroundProps) {
  return (
    <View style={style}>
      <OpenCVImage {...props} style={[StyleSheet.absoluteFill, imageStyle]} />
      {children}
    </View>
  );
}
