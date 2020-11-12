import { combineReducers } from "redux";
import questionsReducer from "./questions";
import userReducer from "./user";
import answersReducer from "./answers";
import uiReducer from "./ui";
import tagsReducer from "./tags"

export default combineReducers({
  questions: questionsReducer,
  answers: answersReducer,
  user: userReducer,
  ui: uiReducer,
  tags: tagsReducer,
});
