import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../store/questions";
import * as ui from "../store/ui";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import Screen from "../components/Screen";
import defaultStyles from "../config/styles";
import LogoName from "../components/LogoName";
import LoadingIndicator from "../components/LoadingIndicator";
import colors from "../config/colors";
import TagInput from "../components/TagInput";
import { getUnselectedTags } from "../store/tags";

const validationSchema = Yup.object().shape({
  questionContent: Yup.string()
    .required("You cannot submit an empty question.")
    .label("Question")
    .min(10)
    .max(255),
});

function AskQuestion({ navigation }) {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.userName);
  const isAddingQuestion = useSelector((state) => state.ui.loading);
  const successfulyAddedQuestion = useSelector((state) => state.ui.success);
  const errorText = useSelector((state) => state.ui.errorContent);
  const suggestions = useSelector(getUnselectedTags);
  const tagsSelected = useSelector((state) => state.tags.tagsSelected);

  if (successfulyAddedQuestion) {
    dispatch(ui.resetSuccess());
    navigation.navigate("Home");
  }

  const handleOnSubmit = (questionContent) => {
    dispatch(
      actions.addQuestion({
        author: userName,
        content: questionContent,
        tags: tagsSelected,
      })
    );
  };

  return (
    <Screen style={styles.screen}>
      <LogoName />
      <View style={styles.container}>
        <AppForm
          validationSchema={validationSchema}
          initialValues={{ questionContent: "" }}
          onSubmit={(values) => handleOnSubmit(values.questionContent)}
        >
          <AppFormField
            numberOfLines={5}
            multiline={true}
            maxLength={256}
            textAlignVertical={"top"}
            textBreakStrategy={"highQuality"}
            autoCapitalize="none"
            autoCorrect
            autoFocus={true}
            name="questionContent"
            keyboardType="default"
            placeholder="Question content"
            textContentType="none"
            textStyle={styles.questionInput}
          />
          <View
            style={{
              alignSelf: "center",
              borderRadius: 15,
              overflow: "hidden",
              width: 300,
            }}
          >
            <TagInput
              suggestions={suggestions}
              tagsSelected={tagsSelected}
              maxTags={3}
              placeholder="add up to three tags"
            />
          </View>
          <SubmitButton
            style={{ backgroundColor: colors.focus }}
            textStyle={{ color: colors.light }}
            title="Post the question"
            disabled={isAddingQuestion}
          />
        </AppForm>
        <LoadingIndicator
          isLoading={isAddingQuestion}
          defaultText={null}
          loadingText="Posting your question. Please wait..."
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

export default AskQuestion;
