import React, { useState } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Collapsible from "react-native-collapsible";
import AppText from "./AppText";
import AppButton from "./AppButton";
import { AppForm, AppFormField, SubmitButton } from "./forms";
import { addHansardLink } from "../store/questions";
import colors from "../config/colors";

function HansardLink({ question }) {
  const [linkEditVisible, setlinkEditVisible] = useState(false);
  const dispatch = useDispatch();

  const toggleLinkEdit = () => {
    setlinkEditVisible(!linkEditVisible);
  };

  const validationSchema = Yup.object().shape({
    link: Yup.string()
      .required()
      .label("Hansard link")
      .url()
      .max(120)
      .matches(
        /^https:\/\/hansard\.parliament\.vic\.gov\.au\/..*/,
        "Please provide a valid link to a Hansard document"
      ),
  });

  return (
    <View style={styles.container}>
      {!question.hansardLink && (
        <View style={styles.linkRow}>
          <AppText style={[styles.link, { textDecorationLine: "none" }]}>
            No Hansard link has been added for this question yet.
          </AppText>
          <AppButton
            style={styles.button}
            textStyle={styles.buttonText}
            title={linkEditVisible ? "close" : "add link"}
            onPress={toggleLinkEdit}
          />
        </View>
      )}
      {question.hansardLink && (
        <View style={styles.linkRow}>
          <AppText
            style={[styles.link, { textAlign: "left" }]}
            onPress={() => Linking.openURL(question.hansardLink)}
          >
            See the answer in Hansard.
          </AppText>
          <AppButton
            style={styles.button}
            textStyle={styles.buttonText}
            title={linkEditVisible ? "close" : "edit link"}
            onPress={toggleLinkEdit}
          />
        </View>
      )}
      <Collapsible collapsed={!linkEditVisible}>
        <AppForm
          onSubmit={(values) => {
            dispatch(
              addHansardLink({
                questionId: question.questionId,
                hansardLink: values.link,
              })
            );
            setlinkEditVisible(false);
          }}
          validationSchema={validationSchema}
          initialValues={{
            link: !question.hansardLink
              ? "https://hansard.parliament.vic.gov.au/"
              : question.hansardLink,
          }}
        >
          <AppFormField
            maxLength={120}
            autoCapitalize="none"
            autoCorrect={false}
            icon="link-variant"
            name="link"
            keyboardType="default"
            placeholder="Hansard link"
            textContentType="none"
            defaultValue={
              !question.hansardLink
                ? "https://hansard.parliament.vic.gov.au/"
                : question.hansardLink
            }
            style={{
              marginVertical: 2,
              paddingVertical: 0,
              paddingHorizontal: 10,
            }}
            errorStyle={{ fontSize: 11, marginVertical: 2 }}
            textStyle={{ color: colors.dark, fontSize: 11 }}
          />
          <SubmitButton
            style={styles.addLinkButton}
            textStyle={styles.buttonText}
            title={!question.hansardLink ? "add link" : "edit link"}
          />
        </AppForm>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 3,
    marginHorizontal: 0,
  },
  button: {
    marginVertical: 5,
    width: 65,
    padding: 5,
    marginHorizontal: 10,
    backgroundColor: "darkblue",
  },
  addLinkButton: {
    marginVertical: 5,
    width: 65,
    padding: 5,
    marginHorizontal: 10,
    backgroundColor: "darkblue",
    alignSelf: "flex-end",
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
    justifyContent: "space-between",
    width: "100%",
  },
});

export default HansardLink;
