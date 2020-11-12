import {
  setUserName,
  registrationSuccessful,
  checkUserAccount,
  deleteAccount,
  verificationPending,
  verify,
} from "../user";
import { addQuestion, connectAnswer, setQuestions } from "../questions";
import { addNewTag, resetTagSelection, useTag, setTags } from "../tags";
import { addAnswer, setAnswers } from "../answers";
import fakeBackend from "../../config/fakeBackend";
import * as ui from "../ui";
import { buildReduxData } from "../../clientServices/builders/reduxDataBuilders";

const db = require("../../clientServices/dbConnection");

const serverlessApi = ({ dispatch, getState }) => (next) => async (action) => {
  // action: {type: "user/setUserName", payload: {userName: "..."}}
  if (action.type === setUserName.type) {
    dispatch(ui.startLoading());

    // await and handle server response
    await sleep(1500);

    // if success
    if (true) {
      next(action);
      dispatch(registrationSuccessful());
      dispatch(ui.endLoading());
    }

    // if failure set errorContent to a string to be displayed to the user
    else {
      dispatch(ui.setError({ errorContent: "Bad Error has occurred." }));
      dispatch(ui.endLoading());
    }
  }

  // currently action: {type: "questions/addQuestion", payload: {content: "...", author: "...", tags: array of tags}}
  // tag: {
  //  name: "nameOfTag",
  //  count: number of times used so far. ui sets it to 1 if the tag is newly generated (i.e. has no id)
  //        the ui will increment its count value for the tag in redux, so only count uses before now
  //        (i.e. if this is the 10th time this tag is about to be used, set used to 9)
  //  tagId: self explanatory
  //  }
  else if (action.type === addQuestion.type) {
    dispatch(ui.startLoading());

    // await and handle server response
    await sleep(1500);

    // on success set the action.payload.questionId to a value received from the server
    if (true) {
      // change between here
      const state = getState();
      const questionId = state.questions.questionList.length;
      action.payload.questionId = questionId;

      // also iterate through tag objects in tags array and if they're missing tagIds obtain them from server
      // missing tagId means the tag was user generated just now
      let nextFreeTagId = state.tags.tags.length;
      let tagsWithId = [];

      for (let i = 0; i < action.payload.tags.length; i++) {
        if (action.payload.tags[i].hasOwnProperty("tagId")) {
          tagsWithId.push(action.payload.tags[i]);
          dispatch(useTag(action.payload.tags[i]));
        } else {
          const newTag = {
            name: action.payload.tags[i].name,
            count: action.payload.tags[i].count,
            tagId: nextFreeTagId,
          };
          dispatch(addNewTag(newTag));
          nextFreeTagId++;
          tagsWithId.push(newTag);
        }
      }

      action.payload.tags = tagsWithId;
      // and here ^

      next(action);

      dispatch(resetTagSelection());
      dispatch(ui.success());
      dispatch(ui.endLoading());
    }

    // on failure set errorContent to a string to be displayed to the user
    else {
      dispatch(ui.setError({ errorContent: "Bad Error has occurred." }));
      dispatch(ui.endLoading());
    }
  }
  // currently action:
  // {type: "answers/addAnswer", payload: {content: "...", author: "...", questionId: #, answerId: #}}
  else if (action.type === addAnswer.type) {
    dispatch(ui.startLoading());

    // await and handle server response
    await sleep(1500);

    // on success set action.payload.answerId to an appropriate value
    if (true) {
      // change between here v
      const state = getState();
      const answerId = Object.keys(state.answers.answerDict).length;
      action.payload.answerId = answerId;
      // and here ^

      next(action);

      dispatch(
        connectAnswer({
          questionId: action.payload.questionId,
          answerId: action.payload.answerId,
        })
      );
      dispatch(ui.success());
      dispatch(ui.endLoading());
    }

    // on failure set errorContent to a string to be displayed to the user
    else {
      dispatch(ui.setError({ errorContent: "Bad Error has occurred." }));
      dispatch(ui.endLoading());
    }
  } else if (action.type === checkUserAccount.type) {
    dispatch(ui.startLoading());
    await sleep(1500);

    // if user has an account set the retrieved username
    if (false) {
      action.payload = { userName: "nameFromSecStorage" };
      next(action);
      dispatch(ui.success());
      dispatch(ui.endLoading());
    }
    //if user does not have account just dispatch endLoading
    else {
      dispatch(ui.endLoading());
    }
  } else if (action.type === verificationPending.type) {
    dispatch(ui.startLoading());
    const emailAddress = action.payload;

    // await and handle server response
    await sleep(500);

    // if success
    if (true) {
      next(action);
      dispatch(ui.success());
      dispatch(ui.endLoading());
    }

    // if failure set errorContent to a string to be displayed to the user
    else {
      dispatch(ui.setError({ errorContent: "Bad Error has occurred." }));
      dispatch(ui.endLoading());
    }
  } else if (action.type == verify.type) {
    dispatch(ui.startLoading());
    const verificationCode = action.payload;
    // check if verification code is right
    await sleep(2000);

    // on success
    if (true) {
      dispatch(ui.endLoading());
      next(action);
    } else {
      dispatch(ui.setError({ errorContent: "Bad Error has occurred." }));
      dispatch(ui.endLoading());
    }
  } else if (action.type === "refresh") {
    dispatch(ui.fetchData());
    dispatch(ui.startLoading());

    // ******************************
    // retrieve data from server here
    // ******************************

    // replace if true with if successfully retrieved data
    if (true) {
      // Get all data from sqlite
      //let reduxData = await buildReduxData();
      //console.log(reduxData);

      dispatch(
        // replace fakeBackend.questions with an array of questions from server
        // replace fakeBackend.userVotes with a dict of user's votes on questions
        setQuestions({
          questionList: fakeBackend.questions,
          userVotes: fakeBackend.userVotes,
        })
      );

      // replace fakeBackend.answers with a dict of answers
      // replace fakeBackend.userAnswerVotes with a dict of user's votes on answers
      dispatch(
        setAnswers({
          answerDict: fakeBackend.answers,
          userVotes: fakeBackend.userAnswerVotes,
        })
      );

      // replace fakeBackend.tags with an array of tags
      dispatch(setTags({ tags: fakeBackend.tags }));

      dispatch(ui.endLoading());
    }

    // failure scenario:
    else {
      // set errorContent to whatever error message you want to display
      dispatch(ui.setError({ errorContent: "Bad Error has occurred." }));
      dispatch(ui.endLoading());
    }
  } else if (action.type === deleteAccount.type) {
    // send delete request

    next(action);
  } else {
    next(action);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default serverlessApi;
