import React from "react";
import { StyleSheet, Image } from "react-native";

function LogoName() {
  return (
    <Image style={styles.logo} source={require("../assets/logoName.png")} />
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
});

export default LogoName;
