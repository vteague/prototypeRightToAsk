import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { questionRepo } from "../clientServices/repositories/LogicRepositories";
import fakeBackend from "../config/fakeBackend";

const slice = createSlice({
  name: "questions",
  initialState: {
    questionList: [],
    userVotes: {},
    filter: { text: "", tags: [] },
  },
  reducers: {
    setQuestions: (state, action) => {
      state.questionList = action.payload.questionList;
      state.userVotes = action.payload.userVotes;
      // console.log(
      //   "-------------------------------Set questions in redux to:---------------------------------------\n",
      //   state.questionList
      // );
      // console.log(
      //   "-------------------------------Set user votes in redux to:---------------------------------------\n",
      //   state.userVotes
      // );
    },
    addQuestion: (state, action) => {
      const question = {
        ...action.payload,
        answered: false,
        answerIdList: [],
        upVotes: 0,
        downVotes: 0,
        timeStamp: Date.now(),
        tags: [],
      };

      for (var i in action.payload.tags) {
        question.tags.push(action.payload.tags[i].tagId);
      }
      state.questionList.push(question);
      state.userVotes[question.questionId] = 0;
    },
    connectAnswer: (state, action) => {
      const qID = action.payload.questionId;
      const aID = action.payload.answerId;

      const question = state.questionList.find((q) => q.questionId == qID);
      question.answerIdList.push(aID);
    },
    addHansardLink: (state, action) => {
      const questionId = action.payload.questionId;
      const questionIndex = state.questionList.findIndex(
        (q) => q.questionId === questionId
      );
      state.questionList[questionIndex].hansardLink =
        action.payload.hansardLink;
    },
    voteUp: (state, action) => {
      const questionId = action.payload.questionId;
      const questionIndex = state.questionList.findIndex(
        (q) => q.questionId === questionId
      );

      const currentVoteValue = state.userVotes[questionId];
      if (currentVoteValue === -1) {
        state.questionList[questionIndex].downVotes--;
      }
      state.userVotes[questionId] = 1;
      state.questionList[questionIndex].upVotes++;
    },
    voteDown: (state, action) => {
      const questionId = action.payload.questionId;
      const questionIndex = state.questionList.findIndex(
        (q) => q.questionId === questionId
      );

      const currentVoteValue = state.userVotes[questionId];
      if (currentVoteValue === 1) {
        state.questionList[questionIndex].upVotes--;
      }
      state.userVotes[questionId] = -1;
      state.questionList[questionIndex].downVotes++;
    },
    voteNeutral: (state, action) => {
      const questionId = action.payload.questionId;
      const questionIndex = state.questionList.findIndex(
        (q) => q.questionId === questionId
      );

      if (state.userVotes[questionId] === 1) {
        state.questionList[questionIndex].upVotes--;
      } else if (state.userVotes[questionId] === -1) {
        state.questionList[questionIndex].downVotes--;
      }
      state.userVotes[questionId] = 0;
    },
    changeFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
  },
});

export default slice.reducer;
export const {
  addQuestion,
  addHansardLink,
  voteUp,
  voteDown,
  voteNeutral,
  changeFilter,
  connectAnswer,
  setQuestions,
} = slice.actions;

const arraysShareElement = (a, b) => {
  if (a.length === 0 || b.length === 0) return false;

  const intersection = a.filter((element) => b.includes(element));

  return intersection.length > 0 ? true : false;
};

export const getFilteredQuestions = createSelector(
  (state) => state.questions.questionList,
  (state) => state.questions.filter,
  (questionList, filter) => {
    if (filter.text !== "") {
      questionList = questionList.filter((question) =>
        question.content.toLowerCase().includes(filter.text.toLowerCase())
      );
    }
    if (filter.tags.length > 0) {
      questionList = questionList.filter((question) =>
        arraysShareElement(question.tags, filter.tags)
      );
    }
    return questionList;
  }
);

export const getQuestionById = (questionId) =>
  createSelector(
    (state) => state.questions.questionList,
    (questionList) => questionList.find((q) => q.questionId === questionId)
  );
