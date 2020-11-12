import React from "react";
import { View, StyleSheet } from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import LogoName from "../components/LogoName";
import Screen from "../components/Screen";
import { useDispatch, useSelector } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import { checkUserAccount } from "../store/user";

function LoadingScreen({ navigation }) {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.ui.loading);
  const hasAccount = useSelector((state) => state.user.hasAccount);

  const navigateTo = (Screen) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Screen }],
      })
    );
  };

  if (isLoading) {
    dispatch(checkUserAccount());
  } else if (hasAccount) {
    navigateTo("Home");
  } else {
    navigateTo("RegisterAccount");
  }

  return (
    <Screen>
      <LogoName />
      <View style={styles.container}>
        <LoadingIndicator
          isLoading={isLoading}
          loadingText="Loading the App, please wait..."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default LoadingScreen;
