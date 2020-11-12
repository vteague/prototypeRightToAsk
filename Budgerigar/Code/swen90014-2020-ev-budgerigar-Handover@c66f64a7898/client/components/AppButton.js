import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import defaultStyles from "../config/styles";

const AppButton = ({ title, onPress, style, textStyle, disabled }) => {
  return (
    <View style={{ opacity: disabled ? 0.2 : 1 }}>
      <TouchableOpacity
        disabled={disabled}
        style={[styles.button, style]}
        onPress={onPress}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: defaultStyles.colors.backgroundVariant,
  },
  text: {
    color: defaultStyles.colors.dark,
    fontSize: 18,
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AppButton;
