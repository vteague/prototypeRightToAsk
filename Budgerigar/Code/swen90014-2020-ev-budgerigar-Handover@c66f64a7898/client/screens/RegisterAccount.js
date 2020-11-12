import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { CommonActions } from "@react-navigation/native";

import Screen from "../components/Screen";
import LoadingIndicator from "../components/LoadingIndicator";
import defaultStyles from "../config/styles";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import LogoName from "../components/LogoName";
import { setUserName } from "../store/user";
import { clear, read, remember } from "../Crypto"


const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "Username can only contain letters, numbers and underscores"
    )
    .label("Username")
    .min(4)
    .max(30),
});

function RegisterAccount({ navigation }) {

  const dispatch = useDispatch();
  const hasAccount = useSelector((state) => state.user.hasAccount);
  const isRegistering = useSelector((state) => state.ui.loading);
  const errorText = useSelector((state) => state.ui.errorContent);

  const navigateToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  };

  if (hasAccount) {
    navigateToHome();
  }

  // this will be used to call business logic responsible for registering the account
  const handleOnSubmit = (userName) => {
    Alert.alert(
      "Confirm your username",
      "You will not be able to change your username after you complete the registration.\n\nAre you sure you would like to continue?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            dispatch(setUserName({ userName }));
          },
        },
      ]
    );
  };

  return (
    <Screen style={styles.screen}>
      <LogoName />
      <View style={styles.formContainer}>
        <LoadingIndicator
          isLoading={isRegistering}
          defaultText="Register an account to start using the app and make yourself heard!"
          loadingText="Registering your account, please wait..."
          errorText={errorText}
        />
        <AppForm
          style={styles.appForm}
          onSubmit={(values) => handleOnSubmit(values.username)}
          validationSchema={validationSchema}
          initialValues={{ username: "" }}
        >
          <AppFormField
            maxLength={30}
            autoCapitalize="none"
            autoCorrect={false}
            icon="account"
            name="username"
            keyboardType="default"
            placeholder="desired username"
            textContentType="none"
          />
          <SubmitButton
            title="Register account"
            disabled={isRegistering}
            style={{ width: "80%" }}
          />
        </AppForm>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: defaultStyles.colors.background,
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
});

export default RegisterAccount;
