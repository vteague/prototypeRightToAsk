import {
  setUserName,
  registrationSuccessful,
  checkUserAccount,
  verificationPending,
  verify,
  deleteAccount,
} from "../user";
import {
  addQuestion,
  connectAnswer,
  addHansardLink,
  voteUp,
  voteDown,
  voteNeutral,
  setQuestions,
} from "../questions";
import { addNewTag, resetTagSelection, useTag, setTags } from "../tags";
import { deleteUser, generatePair, read} from "../../Crypto";
import {
  register,
  postQuestion,
  postAnswer,
  verifyMP,
  sendHansardLink,
  deleteUserRequest,
  syncDB,
  sendVotes,
  verifyMPCode,
} from "../../ApiCalls";

import {
  addAnswer,
  voteAnswerDown,
  voteAnswerNeutral,
  voteAnswerUp,
  setAnswers,
} from "../answers";

const db = require("../../clientServices/dbConnection");

import { number } from "yup";

import * as ui from "../ui";
import { USERNAME, PRIVATE_KEY } from "../../CONSTANTS";
import { buildReduxData } from "../../clientServices/builders/reduxDataBuilders";

const voteTypes = [
  voteAnswerDown.type,
  voteAnswerNeutral.type,
  voteAnswerUp.type,
  voteDown.type,
  voteNeutral.type,
  voteUp.type,
];

const api = ({ dispatch, getState }) => (next) => async (action) => {
  var state = getState();
  // action: {type: "user/setUserName", payload: {userName: "..."}}
  if (action.type === setUserName.type) {
    dispatch(ui.startLoading());
    await sleep(100);
    generatePair()
      .then(() => {
        register(action.payload.userName).then((res) => {
          if (res.data == 400) {
            // handle username taken
            console.log("ERROR signing up user (username taken)");
          } else {
            console.log("registered");
            next(action);
            dispatch(registrationSuccessful());
            dispatch(ui.endLoading());
          }
        });
      })
      .catch((error) => {
        dispatch(ui.setError({ errorContent: error }));
        dispatch(ui.endLoading());
      });
  }

  // currently action: {type: "questions/addQuestion", payload: {content: "...", author: "..."}}
  // once IDs are server generated the action payload will require an id field,
  // and the reducer will need to be changed receive IDs instead of generating them
  else if (action.type === addQuestion.type) {
    //db.debugPrintDB();
    dispatch(ui.startLoading());

    // tags that were just generated
    let newTags = [];
    // tags that were already in redux
    let oldTags = [];

    for (let i = 0; i < action.payload.tags.length; i++) {
      // if tag is missing the id it was just generated
      if (!action.payload.tags[i].hasOwnProperty("tagId")) {
        newTags.push(action.payload.tags[i]);
      }
      // if tag has a tagId then it was already present in redux
      else {
        oldTags.push(action.payload.tags[i]);
      }
    }
    // increment use count for every oldTag in redux
    for (let i = 0; i < oldTags.length; i++) {
      dispatch(useTag(oldTags[i]));
    }

    postQuestion(
      action.payload.author,
      action.payload.content,
      action.payload.tags
    )
      .then((res) => {
        console.log(`NEW QUESTION ${res.data.details.id} ADDED SUCCESFULLY`);
        console.log("Response:\n", res.data);
        action.payload.questionId = res.data.details.id;

        for (let i = 0; i < newTags.length; i++) {
          // set the tag ID on the tags missing IDs based on response

          newTags[i].tagId = res.data.details.tags.find(
            (t) => t.tag === newTags[i].name
          ).tagId;

          // add the new tags to redux
          dispatch(addNewTag(newTags[i]));
        }

        next(action);
        dispatch(resetTagSelection());
        dispatch(ui.success());
        dispatch(ui.endLoading());
      })
      .catch((error) => {
        console.log("UI send question error");
        dispatch(ui.setError({ errorContent: error }));
        dispatch(ui.endLoading());
      });
  }
  // currently action:
  // {type: "answers/addAnswer", payload: {content: "...", author: "...", questionId: #, answerId: #}}
  // answerId is generated on the AddAnswer screen based on nextUID field in redux store/answers
  // once it's generated server-side the reducer will need to be changed receive IDs similarly to addquestion action
  else if (action.type === addAnswer.type) {
    dispatch(ui.startLoading());

    postAnswer(
      action.payload.author,
      action.payload.content,
      action.payload.questionId
    )
      .then((res) => {
        action.payload.answerId = res.data.details.id;
        console.log("REDUX RES id: " + res.data.details.id);
        next(action);
        dispatch(
          //Not sure if this is working
          connectAnswer({
            questionId: res.data.details.questionID,
            answerId: res.data.details.id,
          })
        );

        dispatch(ui.success());
        dispatch(ui.endLoading());
      })
      .catch((error) => {
        dispatch(ui.setError({ errorContent: error }));
        dispatch(ui.endLoading());
      });
  } else if (action.type === checkUserAccount.type) {

    //If user has an account
    read(PRIVATE_KEY)
      .then((key) => {
        if (key) {
          read(USERNAME).then((username) => {
            if (username) {
              console.log(
                `${username} already has an account with key = ${key}`
              );
              action.payload = { userName: username };
              next(action);
              dispatch(ui.endLoading());
            } else {
              dispatch(ui.endLoading());
            }
          });
        } else {
          dispatch(ui.endLoading());
        }
      })
      .catch((error) => {
        dispatch(ui.setError({ errorContent: error }));
        dispatch(ui.endLoading());
      });
  } else if (action.type === verificationPending.type) {
    dispatch(ui.startLoading());
    console.log(action);
    state = getState();
    username = state.user.userName;
    
    verifyMP(username, action.payload)
    .then((res) => {
      console.log(res);
      next(action);
      dispatch(ui.success());
      dispatch(ui.endLoading());
    })
    .catch((error) => {
      dispatch(ui.setError({ errorContent: "Bad Error has occurred." }));
      dispatch(ui.endLoading());
    });

  } else if (action.type === verify.type) {
    dispatch(ui.startLoading());
    const verificationCode = action.payload;
    // check if verification code is right
    verifyMPCode(state.user.userName, verificationCode)
      .then(() => {
        dispatch(ui.endLoading());
        next(action);
      })
      .catch((error) => {
        dispatch(ui.setError({ errorContent: "Bad Error has occurred." }));
        dispatch(ui.endLoading());
      });
  } else if (action.type === addHansardLink.type) {
    console.log(action);
    username = state.user.userName
 
    sendHansardLink(action.payload.questionId, action.payload.hansardLink,username)
      .then((res) => {
      console.log(res);
      next(action);
    })
    .catch((error) => {
      console.log("There was an error sending a hansard link: " + error);
    });

  } else if (action.type === deleteAccount.type) {
    deleteUserRequest(state.user.userName);

    next(action);
  } else if (voteTypes.includes(action.type)) {
    next(action);

    state = getState();
    // send request
    console.log("SEND THEM VOTES");
    sendVotes(
      state.user.userName,
      state.questions.userVotes,
      state.answers.userVotes
    );
  } else if (action.type === "refresh") {
    console.log("Refresh called");
    dispatch(ui.fetchData());
    dispatch(ui.startLoading());
    // ******************************
    // retrieve data from server here
    // ******************************
    await syncDB(state.user.userName);
    // Get all data from sqlite
    let reduxData = await buildReduxData();
    console.log(reduxData);

    dispatch(
      setQuestions({
        questionList: reduxData.questions,
        userVotes: reduxData.userVotes,
      })
    );
    dispatch(
      setAnswers({
        answerDict: reduxData.answers,
        userVotes: reduxData.userAnswerVotes,
      })
    );

    dispatch(setTags({ tags: reduxData.tags }));

    dispatch(ui.endLoading());
  } else {
    next(action);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default api;
