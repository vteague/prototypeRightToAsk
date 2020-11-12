import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Icon = ({
  name,
  size = 40,
  backgroundColor = "#000",
  iconColor = "#fff",
  style,
}) => {
  return (
    <View
      style={[
        {
          backgroundColor,
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={name}
        color={iconColor}
        size={size * 0.66}
      />
    </View>
  );
};

export default Icon;
