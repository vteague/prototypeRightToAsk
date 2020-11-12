import React from "react";
import { StyleSheet } from "react-native";

import AppText from "../AppText";

const ErrorMessage = ({ error, visible, style }) => {
  if (!visible || !error) return null;
  return <AppText style={[styles.error, style]}>{error}</AppText>;
};

const styles = StyleSheet.create({
  error: { color: "red", textAlign: "center" },
});

export default ErrorMessage;
