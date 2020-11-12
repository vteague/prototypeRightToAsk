import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import fakeBackend from "../config/fakeBackend";

const slice = createSlice({
  name: "answers",
  initialState: {
    answerDict: {},
    userVotes: {},
  },
  reducers: {
    setAnswers: (state, action) => {
      state.answerDict = action.payload.answerDict;
      state.userVotes = action.payload.userVotes;
      // console.log(
      //   "-------------------------------Set answers in redux to:-------------------------------\n",
      //   state.answerDict
      // );
    },
    addAnswer: (state, action) => {
      const answer = {
        content: action.payload.content,
        author: action.payload.author,
        answerId: action.payload.answerId,
        upVotes: 0,
        downVotes: 0,
        timeStamp: Date.now(),
      };

      if (!answer.hasOwnProperty("answerId")) {
        answer.answerId = Object.keys(state.answerDict).length;
      }

      state.answerDict[answer.answerId] = answer;
      state.userVotes[answer.answerId] = 0;
    },
    voteAnswerUp: (state, action) => {
      const answerId = action.payload.answerId;
      const currentVoteValue = state.userVotes[answerId];
      if (currentVoteValue === -1) {
        state.answerDict[answerId].downVotes--;
      }
      state.userVotes[answerId] = 1;
      state.answerDict[answerId].upVotes++;
    },
    voteAnswerDown: (state, action) => {
      const answerId = action.payload.answerId;
      const currentVoteValue = state.userVotes[answerId];
      if (currentVoteValue === 1) {
        state.answerDict[answerId].upVotes--;
      }
      state.userVotes[answerId] = -1;
      state.answerDict[answerId].downVotes++;
    },
    voteAnswerNeutral: (state, action) => {
      const answerId = action.payload.answerId;

      if (state.userVotes[answerId] === 1) {
        state.answerDict[answerId].upVotes--;
      } else if (state.userVotes[answerId] === -1) {
        state.answerDict[answerId].downVotes--;
      }
      state.userVotes[answerId] = 0;
    },
  },
});

export default slice.reducer;
export const {
  addAnswer,
  voteAnswerUp,
  voteAnswerDown,
  voteAnswerNeutral,
  changeFilter,
  setAnswers,
} = slice.actions;

export const getAnswerById = (answerId) =>
  createSelector(
    (state) => state.answers.answerDict,
    (answerDict) => answerDict[answerId]
  );

export const getAnswersByQuestionId = (questionId) =>
  createSelector(
    (state) => state.questions.questionList,
    (state) => state.answers.answerDict,
    (questionList, answerDict) => {
      const questionIndex = questionList.findIndex(
        (q) => q.questionId === questionId
      );
      return questionList[questionIndex].answerIdList.map(
        (answerId) => answerDict[answerId]
      );
    }
  );
