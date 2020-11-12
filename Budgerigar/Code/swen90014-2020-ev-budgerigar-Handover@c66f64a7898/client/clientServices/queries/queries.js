var queries = {};

// Read SQL queries on server start

// Init Queries
queries.createUsers             = require('./init/createUsers.js').query;
queries.createQuestions         = require('./init/createQuestions.js').query;
queries.createAnswers           = require('./init/createAnswers.js').query;
queries.createLinks             = require('./init/createLinks.js').query;
queries.createTags              = require('./init/createTags.js').query;
queries.createTag               = require('./init/createTag.js').query;


// Delete-related queries
queries.dropUsers               = require('./delete/dropUsers.js').query;
queries.dropQuestions           = require('./delete/dropQuestions.js').query;
queries.dropAnswers             = require('./delete/dropAnswers.js').query;
queries.dropLinks               = require('./delete/dropLinks.js').query;
queries.dropTags                = require('./delete/dropTags.js').query;
queries.dropTag                 = require('./delete/dropTag.js').query;



// User-related queries
queries.getUserFromID           = require('./users/getUserFromID.js').query;
queries.getUserFromName         = require('./users/getUserFromName.js').query;
queries.getUserFromPublicKey    = require('./users/getUserFromPublicKey.js').query;
queries.getUsers                = require('./users/getUsers.js').query;
queries.insertUser              = require('./users/insertUser.js').query;
queries.updateUsername          = require('./users/updateUsername.js').query;
queries.updateUserMP            = require('./users/updateUserMP.js').query;
queries.deleteAllUserRows       = require('./users/deleteAllUserRows.js').query;


// // Question-related queries
queries.insertQuestion          = require('./questions/insertQuestion.js').query;
queries.updateQuestion          = require('./questions/updateQuestion.js').query;
queries.getQuestionVotes        = require('./questions/getQuestionVotes.js').query;
queries.getQuestions            = require('./questions/getQuestions.js').query;
queries.getQuestion             = require('./questions/getQuestion.js').query;
queries.deleteAllQuestionRows   = require('./questions/deleteAllQuestionRows.js').query;


// // Answer-related queries
queries.insertAnswer            = require('./answers/insertAnswer.js').query;
queries.updateAnswer            = require('./answers/updateAnswer.js').query;
queries.getAnswerVotes          = require('./answers/getAnswerVotes.js').query;
queries.getAnswersFromQuestionID= require('./answers/getAnswersFromQuestionID.js').query;
queries.getAnswer               = require('./answers/getAnswer.js').query;
queries.getAnswers              = require('./answers/getAnswers.js').query;
queries.deleteAllAnswerRows     = require('./answers/deleteAllAnswerRows.js').query;


// //Link-related queries
queries.insertLink              = require('./links/insertLink.js').query;
queries.getLink                 = require('./links/getLink.js').query;
queries.getLinksFromQuestionID  = require('./links/getLinksFromQuestionID.js').query;
queries.deleteAllLinkRows       = require('./links/deleteAllLinkRows.js').query;

// // Tag-related queries
queries.getTags                 = require('./tags/getTags.js').query;
queries.getTagLink              = require('./tags/getTagLink.js').query;
queries.getTagFromID            = require('./tags/getTagFromID.js').query;
queries.getTagFromTag           = require('./tags/getTagFromTag.js').query;
queries.getTagsFromQuestionID   = require('./tags/getTagsFromQuestionID.js').query;
queries.insertTag               = require('./tags/insertTag.js').query;
queries.linkTagToQuestion       = require('./tags/linkTagToQuestion.js').query;
queries.deleteAllTagRows        = require('./tags/deleteAllTagRows.js').query;
queries.deleteAllTagLinkRows    = require('./tags/deleteAllTagLinkRows.js').query;
queries.getAllFormattedTags     = require('./tags/getAllFormattedTags.js').query;


// Vote-related queries
queries.modifyAnswerVote        = require('./votes/modifyAnswerVote.js').query;
queries.modifyQuestionVote      = require('./votes/modifyQuestionVote.js').query;


module.exports = queries;