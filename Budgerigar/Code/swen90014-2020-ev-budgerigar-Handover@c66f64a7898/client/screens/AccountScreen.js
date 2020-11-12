import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount } from "../store/user";
import LogoName from "../components/LogoName";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import RegisterAsMPComponent from "../components/RegisterAsMPComponent";

function AccountScreen({ navigation }) {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.userName);
  const isMP = useSelector((state) => state.user.MP);

  const handleDeleteAcc = () => {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "You will not be able to undo this action.",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete my account",
          onPress: () => {
            dispatch(deleteAccount());
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "RegisterAccount" }],
              })
            );
          },
        },
      ]
    );
  };

  return (
    <Screen style={styles.container}>
      <LogoName />
      <AppText style={styles.text}>Account Settings</AppText>
      <View style={styles.row}>
        <AppText style={styles.rowHeader}>Username: </AppText>
        <AppText style={styles.data}>@{userName}</AppText>
      </View>
      <View style={styles.row}>
        <AppText style={styles.rowHeader}>User Type: </AppText>
        <AppText style={styles.data}>{isMP ? "MP" : "standard"}</AppText>
      </View>
      <RegisterAsMPComponent />
      <View style={styles.row}>
        <AppButton
          style={styles.button}
          textStyle={styles.buttonText}
          title={"Delete Your Account"}
          onPress={handleDeleteAcc}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background },
  row: {
    flexDirection: "row",
  },
  text: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: colors.dark,
    borderTopColor: colors.focus,
    borderTopWidth: 2,
    marginHorizontal: -10,
    marginTop: -10,
    marginBottom: 10,
  },
  rowHeader: {
    fontWeight: "bold",
  },
  data: {
    color: colors.focus,
  },
  button: {
    minWidth: 120,
    marginVertical: 5,
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.warning,
  },
  buttonText: { fontSize: 11, color: "white" },
  link: {
    width: "66%",
    color: "darkblue",
    paddingRight: 10,
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: 14,
  },
});

export default AccountScreen;
