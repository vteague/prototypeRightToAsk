import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getQuestionById } from "../store/questions";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import defaultStyles from "../config/styles";
import LogoName from "../components/LogoName";
import HansardLink from "../components/HansardLink";
import { getAnswersByQuestionId } from "../store/answers";
import * as actions from "../store/answers";
import * as ui from "../store/ui";
import { getTagById } from "../store/tags";
import AnswerListItem from "../components/AnsweListItem";
import colors from "../config/colors";
import AppButton from "../components/AppButton";

import { answerRepo} from '../clientServices/repositories/LogicRepositories';


//const validationSchema = Yup.object().shape({});

function QuestionDetails({ navigation, route }) {
  const dispatch = useDispatch();
  const question = useSelector(getQuestionById(route.params.questionId));
  const answers = useSelector(getAnswersByQuestionId(question.questionId));
  const isMP = useSelector((state) => state.user.MP);
  const refreshing = useSelector((state) => state.ui.loading);
  const userQVotes = useSelector((state) => state.questions.userVotes);
  const userAVotes = useSelector((state) => state.answers.userVotes);

  const tags = [];
  for (let tagId of question.tags) {
    tags.push(useSelector(getTagById(tagId)));
  }

  const handleUpVote = async (answer) => {
    const answerId = answer.answerId;
    if (userAVotes[answerId] === 1) {
      dispatch(actions.voteAnswerNeutral({ answerId }));
      
      // Update vote in local database
      await answerRepo.updateVote(answerId, 0)

    } else {
      dispatch(actions.voteAnswerUp({ answerId }));

      // Update vote in local database
      await answerRepo.updateVote(answerId, 1)
    }
  };
  const handleDownVote = async (answer) => {
    const answerId = answer.answerId;
    if (userAVotes[answerId] === -1) {
      dispatch(actions.voteAnswerNeutral({ answerId }));

      // Update vote in local database
      await answerRepo.updateVote(answerId, 0)

    } else {
      dispatch(actions.voteAnswerDown({ answerId }));
      
      // Lower vote in local database
      await answerRepo.updateVote(answerId, -1)
    }
  };

  const handleRefresh = () => {};

  const getTagString = () => {
    if (tags.length === 0) return "This question has no tags.";
    let tagString = "";

    for (let tag of tags) {
      tagString += " #" + tag.name;
    }
    return tagString;
  };

  return (
    <Screen style={styles.screen}>
      <LogoName />
      <View style={styles.container}>
        <AppText style={styles.questionContent}>{question.content}</AppText>
        <AppText style={styles.questionDetails}>
          Posted by: @{question.author}
        </AppText>
        <AppText style={styles.questionDetails}>
          Posted on: {moment(question.timeStamp).format("LL")}
        </AppText>
        <AppText style={styles.questionDetails}>Tags: {getTagString()}</AppText>
      </View>
      <HansardLink question={question} />

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        {answers.length === 0 && (
          <View style={styles.questionNotAnsweredBox}>
            <AppText style={{ textAlign: "center", fontWeight: "bold" }}>
              This question has not been answered yet.
            </AppText>
          </View>
        )}
      </View>

      {(answers.length > 0 || isMP) && (
        <View
          style={[
            styles.list,
            answers.length === 0
              ? { backgroundColor: "transparent", borderColor: "transparent" }
              : {},
          ]}
        >
          <FlatList
            data={answers}
            removeClippedSubviews={false}
            keyExtractor={(answer) => answer.answerId.toString()}
            ListHeaderComponent={
              isMP && (
                <AppButton
                  style={{ backgroundColor: colors.focus }}
                  textStyle={{ color: colors.light }}
                  title="Add your answer"
                  onPress={() => {
                    dispatch(ui.resetSuccess());
                    navigation.navigate("AddAnswer", {
                      questionId: route.params.questionId,
                    });
                  }}
                />
              )
            }
            renderItem={({ item }) => (
              <AnswerListItem
                voted={userAVotes[item.answerId]}
                answer={item}
                onPress={() => {}}
                onUpVote={() => {
                  handleUpVote(item);
                }}
                onDownVote={() => {
                  handleDownVote(item);
                }}
              />
            )}
            refreshing={refreshing}
            onRefresh={() => handleRefresh()}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.focus,
    padding: 5,
    marginHorizontal: -5,
  },
  list: {
    borderRadius: 15,
    overflow: "hidden",
    flexShrink: 1,
    borderWidth: 2,
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.focus,
    paddingHorizontal: 3,
    paddingBottom: 0,
    marginHorizontal: -5,
  },
  questionContent: {
    paddingBottom: 5,
  },
  questionDetails: {
    fontSize: 11,
  },
  questionNotAnsweredBox: {
    borderRadius: 15,
    borderWidth: 2,
    height: 50,
    width: 200,
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.focus,
    alignSelf: "center",
    justifyContent: "center",
  },
  screen: {
    backgroundColor: defaultStyles.colors.background,
  },
});

export default QuestionDetails;
