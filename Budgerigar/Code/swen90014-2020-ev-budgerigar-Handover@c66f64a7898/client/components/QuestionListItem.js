import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";

import AppText from "../components/AppText";
import { UpVoteButton, DownVoteButton } from "./voteButtons";
import colors from "../config/colors";
import moment from "moment";
import Icon from "./Icon";

const QuestionListItem = ({
  question,
  onPress,
  onUpVote,
  onDownVote,
  voted,
}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.focus}>
      <View style={styles.container}>
        <View style={styles.questionHeader}>
          <AppText style={styles.headerText}>@{question.author}</AppText>
          <AppText style={styles.headerText}>
            {moment(question.timeStamp).format("LL")}
          </AppText>
        </View>

        <AppText numberOfLines={2} style={{ textAlign: "justify" }}>
          {question.content}
        </AppText>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <TouchableHighlight
            style={styles.voteContainer}
            onPress={() => {}}
            underlayColor={colors.light}
          >
            <>
              <UpVoteButton
                voted={voted === 1 ? true : false}
                voteCount={question.upVotes}
                onPress={onUpVote}
              />
              <DownVoteButton
                voted={voted === -1 ? true : false}
                voteCount={question.downVotes}
                onPress={onDownVote}
              />
            </>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.answerIcons}
            onPress={() => {}}
            underlayColor={colors.light}
          >
            <>
              <Icon
                style={{
                  marginHorizontal: 5,
                  marginTop: 5,
                  display: question.answerIdList.length > 0 ? "flex" : "none",
                }}
                name="message-reply-text"
                size={30}
                backgroundColor={colors.backgroundVariant}
              />
              <Icon
                style={{
                  marginHorizontal: 5,
                  marginTop: 4,
                  display: question.hansardLink ? "flex" : "none",
                }}
                name="link-variant"
                size={30}
                backgroundColor={colors.backgroundVariant}
              />
            </>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  questionHeader: {
    marginTop: -15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 12,
    color: colors.medium,
  },
  container: {
    padding: 15,
    paddingHorizontal: 10,
    alignItems: "flex-start",
    backgroundColor: colors.light,
    borderBottomColor: colors.focus,
    borderBottomWidth: 1,
  },
  voteContainer: {
    width: "30%",
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answerIcons: {
    flexDirection: "row",
  },
});

export default QuestionListItem;
