import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import AppText from "../AppText";
import defaultStyles from "../../config/styles";

function UpVoteButton({ onPress, voted = false, voteCount }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.voteContainer}>
        <AppText style={styles.voteCount}>{voteCount}</AppText>
        <AntDesign
          name={voted ? "like1" : "like2"}
          style={{
            fontSize: 18,
            color: defaultStyles.colors.focus,
            paddingBottom: 3,
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

export default UpVoteButton;
