import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import AppText from "../AppText";
import defaultStyles from "../../config/styles";

function DownVoteButton({ onPress, voted = false, voteCount }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.voteContainer}>
        <AppText style={styles.voteCount}>{voteCount}</AppText>
        <AntDesign
          name={voted ? "dislike1" : "dislike2"}
          style={{
            fontSize: 18,
            color: defaultStyles.colors.focus,
            paddingTop: 3,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  voteCount: {
    paddingRight: 3,
  },
  voteContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default DownVoteButton;
