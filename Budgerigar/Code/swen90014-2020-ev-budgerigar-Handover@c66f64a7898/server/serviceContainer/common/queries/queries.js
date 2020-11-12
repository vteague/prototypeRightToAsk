const fs = require('fs');

const pathToQueries = '' + __dirname;

var queries = {};

// Read SQL queries on server start

// User-related queries
queries.getUserFromID           = fs.readFileSync(pathToQueries + '/users/getUserFromID.sql', 'utf8');
queries.getUserFromName         = fs.readFileSync(pathToQueries + '/users/getUserFromName.sql', 'utf8');
queries.getUserFromPublicKey    = fs.readFileSync(pathToQueries + '/users/getUserFromPublicKey.sql', 'utf8');
queries.getUsersFromTime        = fs.readFileSync(pathToQueries + '/users/getUsersFromTime.sql', 'utf8');
queries.getUsers                = fs.readFileSync(pathToQueries + '/users/getUsers.sql', 'utf8');
queries.insertUser              = fs.readFileSync(pathToQueries + '/users/insertUser.sql', 'utf8');
queries.updateUserUsername      = fs.readFileSync(pathToQueries + '/users/updateUserUsername.sql', 'utf8');
queries.updateUserPublicKey     = fs.readFileSync(pathToQueries + '/users/updateUserPublicKey.sql', 'utf8');
queries.updateUserMP            = fs.readFileSync(pathToQueries + '/users/updateUserMP.sql', 'utf8');
queries.updateUserCode          = fs.readFileSync(pathToQueries + '/users/updateUserCode.sql', 'utf8');
queries.updateUserEmail         = fs.readFileSync(pathToQueries + '/users/updateUserEmail.sql', 'utf8');
queries.deleteAllUserRows       = fs.readFileSync(pathToQueries + '/users/deleteAllUserRows.sql', 'utf8');


// Question-related queries
queries.insertQuestion          = fs.readFileSync(pathToQueries + '/questions/insertQuestion.sql', 'utf8');
queries.getLinkArrays           = fs.readFileSync(pathToQueries + '/questions/getLinkArrays.sql', 'utf8');
queries.getQuestions            = fs.readFileSync(pathToQueries + '/questions/getQuestions.sql', 'utf8');
queries.getQuestion             = fs.readFileSync(pathToQueries + '/questions/getQuestion.sql', 'utf8');
queries.getQuestionsFromTime    = fs.readFileSync(pathToQueries + '/questions/getQuestionsFromTime.sql', 'utf8');
queries.getQuestionsWithAnswers = fs.readFileSync(pathToQueries + '/questions/getQuestionsWithAnswers.sql', 'utf8');
queries.getQuestionWithAnswers  = fs.readFileSync(pathToQueries + '/questions/getQuestionWithAnswers.sql', 'utf8');
queries.deleteQuestion          = fs.readFileSync(pathToQueries + '/questions/deleteQuestion.sql', 'utf8');
queries.deleteAllQuestionRows   = fs.readFileSync(pathToQueries + '/questions/deleteAllQuestionRows.sql', 'utf8');



// Answer-related queries
queries.insertAnswer            = fs.readFileSync(pathToQueries + '/answers/insertAnswer.sql', 'utf8');
queries.getAnswers              = fs.readFileSync(pathToQueries + '/answers/getAnswers.sql', 'utf8');
queries.getAnswersFromQuestion  = fs.readFileSync(pathToQueries + '/answers/getAnswersFromQuestion.sql', 'utf8');
queries.getAnswer               = fs.readFileSync(pathToQueries + '/answers/getAnswer.sql', 'utf8');
queries.getAnswersFromTime      = fs.readFileSync(pathToQueries + '/answers/getAnswersFromTime.sql', 'utf8');
queries.deleteAllAnswerRows     = fs.readFileSync(pathToQueries + '/answers/deleteAllAnswerRows.sql', 'utf8');


//Link-related queries
queries.insertLink              = fs.readFileSync(pathToQueries + '/links/insertLink.sql', 'utf8');
queries.getLink                 = fs.readFileSync(pathToQueries + '/links/getLink.sql', 'utf8');
queries.getLinksFromQuestionID  = fs.readFileSync(pathToQueries + '/links/getLinksFromQuestionID.sql', 'utf8');
queries.getLinks                = fs.readFileSync(pathToQueries + '/links/getLinks.sql', 'utf8');
queries.getLinksFromTime        = fs.readFileSync(pathToQueries + '/links/getLinksFromTime.sql', 'utf8');
queries.deleteAllLinkRows       = fs.readFileSync(pathToQueries + '/links/deleteAllLinkRows.sql', 'utf8');


// Tag-related queries
queries.getTags                 = fs.readFileSync(pathToQueries + '/tags/getTags.sql', 'utf8');
queries.getTagFromID            = fs.readFileSync(pathToQueries + '/tags/getTagFromID.sql', 'utf8');
queries.getTagFromTag           = fs.readFileSync(pathToQueries + '/tags/getTagFromTag.sql', 'utf8');
queries.getTagsFromQuestionID   = fs.readFileSync(pathToQueries + '/tags/getTagsFromQuestionID.sql', 'utf8');
queries.getTagsFromTime         = fs.readFileSync(pathToQueries + '/tags/getTagsFromTime.sql', 'utf8');
queries.insertTag               = fs.readFileSync(pathToQueries + '/tags/insertTag.sql', 'utf8');
queries.deleteAllTagRows        = fs.readFileSync(pathToQueries + '/tags/deleteAllTagRows.sql', 'utf8');

// Tag Link related queries
queries.getTagLinks             = fs.readFileSync(pathToQueries + '/tagLinks/getTagLinks.sql', 'utf8');
queries.linkTagToQuestion       = fs.readFileSync(pathToQueries + '/tagLinks/linkTagToQuestion.sql', 'utf8');
queries.getTagLinksFromTime     = fs.readFileSync(pathToQueries + '/tagLinks/getTagLinksFromTime.sql', 'utf8');
queries.deleteAllTagLinkRows    = fs.readFileSync(pathToQueries + '/tagLinks/deleteAllTagLinkRows.sql', 'utf8');


// Vote-related queries
queries.getUserAnswerVotes      = fs.readFileSync(pathToQueries + '/votes/getUserAnswerVotes.sql', 'utf8');
queries.getUserQuestionVotes    = fs.readFileSync(pathToQueries + '/votes/getUserQuestionVotes.sql', 'utf8');
queries.modifyAnswerVote        = fs.readFileSync(pathToQueries + '/votes/modifyAnswerVote.sql', 'utf8');
queries.modifyQuestionVote      = fs.readFileSync(pathToQueries + '/votes/modifyQuestionVote.sql', 'utf8');
queries.updateAnswerVoteTallies = fs.readFileSync(pathToQueries + '/votes/updateAnswerVoteTallies.sql', 'utf8');
queries.updateQuestionVoteTallies=fs.readFileSync(pathToQueries + '/votes/updateQuestionVoteTallies.sql', 'utf8');

// Test queries
queries.newGetQuestion          = fs.readFileSync(pathToQueries + '/questions/newGetQuestion.sql', 'utf8');
queries.newGetQuestions         = fs.readFileSync(pathToQueries + '/questions/newGetQuestions.sql', 'utf8');

module.exports = queries;