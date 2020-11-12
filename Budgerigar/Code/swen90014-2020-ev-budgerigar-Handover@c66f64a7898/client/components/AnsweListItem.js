import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";

import AppText from "../components/AppText";
import { UpVoteButton, DownVoteButton } from "./voteButtons";
import colors from "../config/colors";
import moment from "moment";
import Icon from "./Icon";

const AnswerListItem = ({ answer, onPress, onUpVote, onDownVote, voted }) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.focus}>
      <View style={styles.container}>
        <View style={styles.answerHeader}>
          <AppText style={styles.headerText}>@{answer.author}</AppText>
          <AppText style={styles.headerText}>
            {moment(answer.timeStamp).format("LL")}
          </AppText>
        </View>

        <AppText style={{ textAlign: "justify" }}>{answer.content}</AppText>
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
                voteCount={answer.upVotes}
                onPress={onUpVote}
              />
              <DownVoteButton
                voted={voted === -1 ? true : false}
                voteCount={answer.downVotes}
                onPress={onDownVote}
              />
            </>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  answerHeader: {
    marginTop: -10,
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
    borderTopColor: colors.focus,
    borderTopWidth: 1,
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

export default AnswerListItem;
