import React, { Children } from "react";
import Constants from "expo-constants";
import { StyleSheet, SafeAreaView } from "react-native";

const Screen = ({ children, style }) => {
  return <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 10,
    flex: 1,
  },
});

export default Screen;
