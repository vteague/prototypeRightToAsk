import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Screen from "../components/Screen";
import QuestionListItem from "../components/QuestionListItem";
import defaultStyles from "../config/styles";
import LogoName from "../components/LogoName";
import Collapsible from "react-native-collapsible";
import AppTextInput from "../components/AppTextInput";
import Icon from "../components/Icon";
import FilterPanel from "../components/FilterPanel";
import * as actions from "../store/questions";
import * as ui from "../store/ui";
import { getFilteredQuestions } from "../store/questions";

import { questionRepo } from '../clientServices/repositories/LogicRepositories';
const db = require('../clientServices/dbConnection');

function Home({ navigation }) {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(true);
  const dispatch = useDispatch();
  const questions = useSelector(getFilteredQuestions);
  const userVotes = useSelector((state) => state.questions.userVotes);
  const refreshing = useSelector((state) => state.ui.loading);
  const initialFetchMade = useSelector((state) => state.ui.initialFetchMade);

  const handleUpVote = async (question) => {
    const questionId = question.questionId;
    if (userVotes[questionId] === 1) {
      dispatch(actions.voteNeutral({ questionId }));
      // Add vote to local database
      await questionRepo.updateVote(questionId, 0)
      await db.debugPrintDB();

    } else {
      dispatch(actions.voteUp({ questionId }));
      // Remove vote from local database
      await questionRepo.updateVote(questionId, 1)
    }
  };

  const handleDownVote = async (question) => {
    const questionId = question.questionId;
    if (userVotes[questionId] === -1) {
      dispatch(actions.voteNeutral({ questionId }));
      
      // Add vote to local database
      await questionRepo.updateVote(questionId, 0)
    } else {
      dispatch(actions.voteDown({ questionId }));
      
      // Remove vote from local database
      await questionRepo.updateVote(questionId, -1)
    }
  };

  // a simple filter on the question list
  const search = (keyword) => {
    dispatch(actions.changeFilter({ text: keyword }));
  };

  // called when question list is pulled down
  const handleRefresh = async () => {
    await db.debugPrintDB();
    dispatch({ type: "refresh", payload: {} });
  };

  // if (!initialFetchMade) {
  //   handleRefresh();
  // }

  return (
    <Screen style={styles.screen}>
      <LogoName />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <AppTextInput
          placeholder="Search..."
          icon="comment-search-outline"
          style={{
            overflow: "scroll",
            width: "88%",
            marginBottom: 5,
          }}
          onChangeText={(text) => search(text)}
          onFocus={() => setFooterVisible(false)}
          onBlur={() => setFooterVisible(true)}
        />
        <TouchableOpacity
          onPress={() => {
            setFiltersVisible(!filtersVisible);
            setFooterVisible(!footerVisible);
          }}
        >
          <Icon
            name="filter-variant"
            size={40}
            backgroundColor={defaultStyles.colors.focus}
          />
        </TouchableOpacity>
      </View>
      <Collapsible collapsed={!filtersVisible}>
        <FilterPanel />
      </Collapsible>
      <View style={styles.list}>
        <FlatList
          data={questions}
          keyExtractor={(question) => question.questionId.toString()}
          renderItem={({ item }) => (
            <QuestionListItem
              voted={userVotes[item.questionId]}
              question={item}
              onPress={() => {
                dispatch(ui.resetSuccess());
                navigation.navigate("QuestionDetails", {
                  questionId: item.questionId,
                });
              }}
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
      <View
        style={[styles.footer, { display: footerVisible ? "flex" : "none" }]}
      >
        <TouchableOpacity
          onPress={() => {
            dispatch(ui.resetSuccess());
            navigation.navigate("AccountScreen");
          }}
        >
          <Icon
            name="account-outline"
            size={80}
            backgroundColor={defaultStyles.colors.focus}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            dispatch(ui.resetSuccess());
            navigation.navigate("AskQuestion");
          }}
        >
          <Icon
            name="comment-question-outline"
            size={80}
            backgroundColor={defaultStyles.colors.focus}
          />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  list: {
    borderRadius: 15,
    overflow: "hidden",
    flex: 1,
    borderWidth: 2,
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.focus,
    padding: 3,
    paddingBottom: 0,
    marginHorizontal: -5,
  },
  screen: {
    backgroundColor: defaultStyles.colors.background,
  },
});

export default Home;
