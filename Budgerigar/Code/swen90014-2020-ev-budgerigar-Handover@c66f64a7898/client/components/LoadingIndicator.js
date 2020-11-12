import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";

import AppText from "../components/AppText";

function LoadingIndicator({ isLoading, defaultText, loadingText, errorText }) {
  return (
    <>
      <AppText style={styles.text}>
        {isLoading ? loadingText : errorText ? errorText : defaultText}
      </AppText>
      <ActivityIndicator animating={isLoading} size={80} />
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 80,
    alignSelf: "center",
    margin: 0,
    padding: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoadingIndicator;
