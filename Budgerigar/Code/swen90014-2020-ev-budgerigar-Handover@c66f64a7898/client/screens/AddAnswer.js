import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../store/answers";
import * as ui from "../store/ui";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import Screen from "../components/Screen";
import defaultStyles from "../config/styles";
import LogoName from "../components/LogoName";
import LoadingIndicator from "../components/LoadingIndicator";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  answerContent: Yup.string()
    .required("You cannot submit an empty answer.")
    .label("Answer")
    .min(10)
    .max(255),
});

function AddAnswer({ navigation, route }) {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.userName);
  const errorText = useSelector((state) => state.ui.errorText);
  const isAddingAnswer = useSelector((state) => state.ui.loading);
  const successfulyAddedAnswer = useSelector((state) => state.ui.success);

  if (successfulyAddedAnswer) {
    dispatch(ui.resetSuccess());
    navigation.navigate("QuestionDetails", {
      questionId: route.params.questionId,
    });
  }

  const handleOnSubmit = (answerContent) => {
    dispatch(
      actions.addAnswer({
        author: userName,
        content: answerContent,
        questionId: route.params.questionId,
      })
    );
  };

  return (
    <Screen style={styles.screen}>
      <LogoName />
      <View style={styles.container}>
        <AppForm
          validationSchema={validationSchema}
          initialValues={{ answerContent: "" }}
          onSubmit={(values) => handleOnSubmit(values.answerContent)}
        >
          <AppFormField
            numberOfLines={5}
            multiline={true}
            maxLength={256}
            textAlignVertical={"top"}
            textBreakStrategy={"highQuality"}
            autoCapitalize="none"
            autoCorrect
            name="answerContent"
            keyboardType="default"
            placeholder="Please write your answer"
            textContentType="none"
            textStyle={styles.questionInput}
          />
          <SubmitButton
            style={{ backgroundColor: colors.focus }}
            textStyle={{ color: colors.light }}
            title="Add your answer"
            disabled={isAddingAnswer}
          />
        </AppForm>
        <LoadingIndicator
          isLoading={isAddingAnswer}
          defaultText={null}
          loadingText="Adding your answer. Please wait..."
          errorText={errorText}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: defaultStyles.colors.background,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  questionInput: {
    fontSize: 14,
    padding: 0,
    flex: 1,
    flexWrap: "wrap",
    overflow: "scroll",
  },
});

export default AddAnswer;
