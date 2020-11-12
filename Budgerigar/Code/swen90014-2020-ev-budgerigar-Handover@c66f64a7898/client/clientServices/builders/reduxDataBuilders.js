const repos = require("../repositories/LogicRepositories");

export const buildReduxData = async function () {
  let reduxData = {};
  reduxData.questions = await _buildQuestionData();
  reduxData.answers = await _buildAnswerData();
  reduxData.tags = await _buildTagData();
  reduxData.userVotes = await _buildUserQuestionVoteData();
  reduxData.userAnswerVotes = await _buildUserAnswerVoteData();

  // console.log("############# Built redux data from SQLite ###############")
  // console.log("Redux data: ", reduxData);

  return reduxData;
};

/**
 * Retrieves all questions from the SQLite database and converts them to redux format
 * @returns a list of all questions in redux format
 */
const _buildQuestionData = async function () {
  // Get all questions from SQLite
  const questions = await repos.questionRepo.getQuestions();
  let reduxQuestions = [];

  for (const question of questions) {
    let reduxQuestion = {};

    reduxQuestion.questionId = question.id;
    reduxQuestion.author = await _getUsername(question.userID);
    reduxQuestion.answerIdList = await _getAnswerIDList(question.id);
    reduxQuestion.content = question.message;
    reduxQuestion.upVotes = question.upVotes;
    reduxQuestion.downVotes = question.downVotes;
    reduxQuestion.timeStamp = _getTimeStamp(question.lastModified);
    reduxQuestion.tags = await _getTagIDList(question.id);

    // add a link if it exists
    let links = await repos.linkRepo.getLinks({ questionID: question.id });
    if (links.length > 0) {
      reduxQuestion.hansardLink = links[0].link;
    }
    reduxQuestions.push(reduxQuestion);
  }

  return reduxQuestions;
};

/**
 * Retrieves all answers from the SQLite database and converts them into redux format
 * @returns a dict mapping questionIDs to redux-format answers
 */
const _buildAnswerData = async function () {
  // Get all answers from SQLite
  const answers = await repos.answerRepo.getAnswers();
  let reduxAnswers = {};

  for (const answer of answers) {
    let reduxAnswer = {};

    reduxAnswer.answerId = answer.id;
    reduxAnswer.author = await _getUsername(answer.userID);
    reduxAnswer.content = answer.message;
    reduxAnswer.upVotes = answer.upVotes;
    reduxAnswer.downVotes = answer.downVotes;
    reduxAnswer.timeStamp = _getTimeStamp(answer.lastModified);

    reduxAnswers[answer.id] = reduxAnswer;
  }

  return reduxAnswers;
};

/**
 * Retrieves all tags from the SQLite database in redux format
 * @returns a list of tags in redux format
 */
const _buildTagData = async function () {
  // Get all answers from SQLite
  const tags = await repos.tagRepo.getFormattedTags();
  return tags;
};

/**
 * Retrieves all user question votes from the SQLite database and returns them in redux format
 * @returns a list of question votes in redux format
 */
const _buildUserQuestionVoteData = async function () {
  // Get all user votes from SQLite
  const votes = await repos.questionRepo.getVotes();
  let reduxVotes = {};
  for (const vote of votes) {
    reduxVotes[vote.qID] = vote.vote;
  }
  return reduxVotes;
};

/**
 * Retrieves all user answer votes from the SQLite database and returns them in redux format
 * @returns a list of answer in redux format
 */
const _buildUserAnswerVoteData = async function () {
  // Get all user votes from SQLite
  const votes = await repos.answerRepo.getVotes();
  let reduxVotes = {};
  for (const vote of votes) {
    reduxVotes[vote.aID] = vote.vote;
  }
  return reduxVotes;
};

const _getUsername = async function (userID) {
  let userDetails = { id: userID };
  let user = await repos.userRepo.getUsers(userDetails);
  if (user == null) {
    // console.log(`User id ${userID} doesn't exist in the SQLite database`);
    return null;
  }
  return user.username;
};

const _getAnswerIDList = async function (questionID) {
  let answerIDList = [];
  let answers = await repos.answerRepo.getAnswers({ questionID: questionID });

  for (const answer of answers) {
    answerIDList.push(answer.id);
  }
  return answerIDList;
};

const _getTimeStamp = function (UTCDate) {
  let date = new Date(UTCDate);
  return date.getTime();
};

const _getTagIDList = async function (questionID) {
  let tagIDList = [];
  let tags = await repos.tagRepo.getTags({ questionID: questionID });
  for (const tag of tags) {
    tagIDList.push(tag.id);
  }
  return tagIDList;
};
