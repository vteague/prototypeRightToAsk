import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Collapsible from "react-native-collapsible";
import AppText from "./AppText";
import AppButton from "./AppButton";
import { AppForm, AppFormField, SubmitButton } from "./forms";
import { verificationPending, verify } from "../store/user";
import colors from "../config/colors";
import LoadingIndicator from "./LoadingIndicator";
import { resetSuccess } from "../store/ui";

function RegisterAsMPComponent() {
  const [emailFieldVisible, setEmailFieldVisible] = useState(false);
  const isMP = useSelector((state) => state.user.MP);
  const pending = useSelector((state) => state.user.verificationPending);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.ui.loading);
  const errorText = useSelector((state) => state.ui.errorContent);
  const success = useSelector((state) => state.ui.success);

  const toggleEmailField = () => {
    setEmailFieldVisible(!emailFieldVisible);
    dispatch(resetSuccess());
  };

  const validationSchemaEmail = Yup.object().shape({
    email: Yup.string()
      .required()
      .label("Email address")
      .email()
      .max(120)
      // .matches(/.*\.gov\.au$/, "Please provide a .gov.au email address"),
  });

  const validationSchemaCode = Yup.object().shape({
    code: Yup.string()
      .required()
      .label("Verification code")
      .matches(/^[0-9]{6}$/, "Verification code is exactly 6 digits long."),
  });

  return (
    <View style={styles.container}>
      {!isMP && (
        <>
          <View style={styles.linkRow}>
            <AppButton
              style={styles.button}
              textStyle={styles.buttonText}
              title={
                emailFieldVisible
                  ? "close"
                  : pending
                  ? "verification pending"
                  : "Verify as MP"
              }
              onPress={toggleEmailField}
            />
          </View>

          <Collapsible collapsed={!emailFieldVisible}>
            {pending && (
              <AppForm
                onSubmit={(values) => {
                  dispatch(resetSuccess());
                  dispatch(verify(values.code));
                }}
                validationSchema={validationSchemaCode}
                initialValues={{
                  code: "",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <AppFormField
                    maxLength={6}
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="safe"
                    name="code"
                    direction="column"
                    keyboardType="number-pad"
                    placeholder="enter your 6-digit verification code"
                    textContentType="none"
                    defaultValue={""}
                    width="75%"
                    style={{
                      marginVertical: 2,
                      paddingVertical: 0,
                      marginHorizontal: 0,
                      paddingHorizontal: 10,
                    }}
                    errorStyle={{ fontSize: 11, marginVertical: 2 }}
                    textStyle={{ color: colors.dark, fontSize: 11 }}
                  />
                  <SubmitButton
                    style={styles.confirmButton}
                    textStyle={styles.buttonText}
                    title={"Confirm"}
                  />
                </View>
              </AppForm>
            )}

            <AppForm
              onSubmit={(values) => {
                dispatch(verificationPending(values.email));
              }}
              validationSchema={validationSchemaEmail}
              initialValues={{
                email: "",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <AppFormField
                  maxLength={120}
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="email"
                  name="email"
                  direction="column"
                  keyboardType="email-address"
                  placeholder="enter an email in the .gov.au domain"
                  textContentType="none"
                  defaultValue={""}
                  width="75%"
                  style={{
                    marginVertical: 5,
                    paddingVertical: 0,
                    marginHorizontal: 0,
                    paddingHorizontal: 10,
                  }}
                  errorStyle={{ fontSize: 11, marginVertical: 2 }}
                  textStyle={{ color: colors.dark, fontSize: 11 }}
                />
                <SubmitButton
                  style={styles.confirmButton}
                  textStyle={styles.buttonText}
                  title={pending ? "re-send" : "Confirm"}
                />
              </View>
            </AppForm>
            {success && (
              <AppText style={{ fontSize: 12, marginLeft: 10 }}>
                A 6-digit verification code was sent to your email.
              </AppText>
            )}
            {(isLoading || errorText !== null) && (
              <LoadingIndicator
                isLoading={isLoading}
                defaultText=""
                loadingText="Please wait..."
                errorText={errorText}
              />
            )}
          </Collapsible>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10,
    marginBottom: 3,
    marginHorizontal: 0,
  },
  button: {
    minWidth: 120,
    marginVertical: 5,
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.focus,
  },
  confirmButton: {
    marginVertical: 2,
    padding: 5,
    marginHorizontal: 5,
    flex: 1,
    maxHeight: 28,
    width: "100%",
    backgroundColor: colors.focus,
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
  linkRow: {
    flexDirection: "row",
    width: "100%",
  },
});

export default RegisterAsMPComponent;
