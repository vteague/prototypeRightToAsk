const QuestionRepository = require('./repositories/questionRepository');
const AnswerRepository = require('./repositories/answerRepository');
const TagRepository = require('./repositories/tagRepository');
const LinkRepository = require('./repositories/linkRepository');
const UserRepository = require('./repositories/userRepository');

const db = require('./dbConnection');

const questionRepo = new QuestionRepository(db)
const answerRepo = new AnswerRepository(db);
const tagRepo = new TagRepository(db);
const linkRepo = new LinkRepository(db);
const userRepo = new UserRepository(db);

var clientSyncUpdate = async function(data) {
    console.log(`Client Sync Time: ${data['sync_time']}`);

    await userRepo.updateTable(data['users']);
    await questionRepo.updateTable(data['questions']);
    await answerRepo.updateTable(data['answers']);
    await tagRepo.updateTable(data['tags']);
    await tagRepo.updateTableLinks(data['tagLinks']);
    await linkRepo.updateTable(data['links']);
}

var clientGetLocalVotes = async function(username) {
    let res = {}
    res.username = username;
    res.questionVotes = await questionRepo.getVotes();
    res.answerVotes = await answerRepo.getVotes();

    return res;
}

/**
 * @param {Question} question the returned question from a POST response
 * @returns {bool} true if successful, false if handling the question failed
 */
var handleQuestionPostResponse = async function(question) {
    var tags = question.tags;
    // Insert the question
    var q = await questionRepo.insertQuestion(question.id, question.userID, question.message,
        question.upVotes, question.downVotes, question.dateCreated, question.lastModified);
    // Check it was inserted correctly
    if (q == null) {
        console.log("Failed to insert question when handling question post response");
        return false;
    }
    for (const tag of tags) {
        var tDetails = {id:tag.id}
        var gotTags = await tagRepo.getTags(tDetails);
        var newTag;
        // Insert the tag if it doesn't exist
        if (!Array.isArray(gotTags) || !gotTags.length) {
            console.log(`Tag ${tag.tag} doesn't exist in SQLite db, inserting new tag`);
            newTag = await tagRepo.insertTag(tag.id, tag.tag);
        }

        else {
            console.log(`Tag ${tag.tag} already exists in SQLite db.`)
        }

        // Insert the tag links
        var tagLink = await tagRepo.linkTagToQuestion(tag.id, question.id);
        if (newTag == [] || tagLink == null) {
            console.log("There was an error inserting the tags into the database");
            return false;
        }
    }
    return true;
}

module.exports = {
    clientSyncUpdate,
    clientGetLocalVotes,
    handleQuestionPostResponse
}
