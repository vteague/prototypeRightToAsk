const { body, validationResult, param}  = require('express-validator');
const db                                = require('../dbConnection')
const VoteRepository                    = require('../repositories/voteRepository');
const UserRepository                    = require('../repositories/userRepository');
const QuestionRepository                = require('../repositories/questionRepository');
const AnswerRepository                  = require('../repositories/answerRepository');
const validators                        = require('../validators/validators');

const voteRepo      = new VoteRepository(db);
const userRepo      = new UserRepository(db);
const questionRepo  = new QuestionRepository(db);
const answerRepo    = new AnswerRepository(db);

// Set of validation functions to use before passing to business logic
var validatePostVotes = [
    body('username')
        .custom((value) => validators.userValidators.validateUserExists(userRepo, value)),
    body('questionVotes').exists().withMessage('Request body requires questionVotes : [ {qID: int, vote: int} ]'),
    body('questionVotes.*.qID')
        .exists().withMessage('questionVotes requires "qID" attribute')
        .isNumeric()
        .custom((value) => validators.questionValidators.validateQuestionID(questionRepo, value)),
    body('questionVotes.*.vote')
        .notEmpty().withMessage('questionVotes requires "vote" attribute')
        .isIn([-1, 0, 1]).withMessage("vote must have a value of -1, 0 or 1"),
    body('answerVotes').exists().withMessage('Request body requires answerVotes : [ {aID: int, vote: int} ]'),
    body('answerVotes.*.aID')
        .notEmpty().withMessage('answerVotes requires "aID" attribute')
        .isNumeric()
        .custom((value) => validators.answerValidators.validateAnswerID(answerRepo, value)),
    body('answerVotes.*.vote')
        .notEmpty().withMessage('answerVotes requires "vote" attribute')
        .isIn([-1, 0, 1]).withMessage("vote must have a value of -1, 0 or 1")
];

// Get a users change in votes
function getChangedQuestionVotes(oldVotes, newVotes) {
    // If no oldVotes assume its empty
    if (oldVotes == null) {
        oldVotes = [];
    }
    // If no newVotes nothing to change
    if (newVotes == null || newVotes.length == 0) {
            return [];
    }
    // Sort Votes by ID for faster matching
    oldVotes.sort((f, s) => f.questionID - s.questionID);
    newVotes.sort((f, s) => f['qID'] - s['qID']);

    // Init change list
    var delta = [];

    var o = 0; // oldVote counter
    var n = 0; // newVote counter

    // While still new votes left to check
    while (n < newVotes.length) {

        // Get oldVote details (if any left)
        var oldQID = -1;
        var oldVote = 0;
        if (o < oldVotes.length) {
            var oldQID = oldVotes[o].questionID;
            var oldVote = oldVotes[o].vote;
        } 
        // Get newVote details
        var newQID = newVotes[n]['qID'];
        var newVote = newVotes[n]['vote'];

        // If oldId < newID (and oldVotes remain) Implies no newVote with this ID, 
        if (oldQID < newQID && o < oldVotes.length) {
            // Increment oldVote to be checked
            o++;
        // If IDs match check if update needed
        } else if (oldQID == newQID) {
            // If no difference in vote nothing to change
            if (oldVote != newVote) {
                var ud = 0;
                var dd = 0;
                if (oldVote == 1)       {ud = -1;} //UpVote Decrease
                else if (oldVote == -1) {dd = -1;} //DownVote Decrease
                if (newVote == 1)       {ud = 1;} //UpVote Increase
                else if (newVote == -1) {dd = 1;} //DownVote Increase
                delta.push({qID: newQID, upDelta: ud, downDelta: dd});             
            }
            // Increment both Vote counters as they have been handled
            o++;
            n++;
        // There was no prior vote information on this new ID
        } else {
            var ud = 0;
            var dd = 0;
            if (newVote == 1)       {ud = 1;}  //UpVote Increase
            else if (newVote == -1) {dd = 1;}  //DownVote Increase
            delta.push({qID: newQID, upDelta: ud, downDelta: dd});    
            // Increment newVote to be checked 
            n++;
        }
    }
    return delta;
}

// Get a users change in votes
function getChangedAnswerVotes(oldVotes, newVotes) {
    // If no oldVotes assume its empty
    if (oldVotes == null) {
        oldVotes = [];
    }
    // If no newVotes nothing to change
    if (newVotes == null || newVotes.length == 0) {
            return [];
    }
    // Sort Votes by ID for faster matching
    oldVotes.sort((f, s) => f.answerID - s.answerID);
    newVotes.sort((f, s) => f['aID'] - s['aID']);

    // Init change list
    var delta = [];

    var o = 0; // oldVote counter
    var n = 0; // newVote counter

    // While still new votes left to check
    while (n < newVotes.length) {

        // Get oldVote details (if any left)
        if (o < oldVotes.length) {
            var oldAID = oldVotes[o].answerID;
            var oldVote = oldVotes[o].vote;
        } 
        // Get newVote details
        var newAID = newVotes[n]['aID'];
        var newVote = newVotes[n]['vote'];

        // If oldId < newID (and oldVotes remain) Implies no newVote with this ID, 
        if (oldAID < newAID && o < oldVotes.length) {
            // Increment oldVote to be checked
            o++;
        // If IDs match check if update needed
        } else if (oldAID == newAID) {
            // If no difference in vote nothing to change
            if (oldVote != newVote) {
                var ud = 0;
                var dd = 0;
                if (oldVote == 1)       {ud = -1;} //UpVote Decrease
                else if (oldVote == -1) {dd = -1;} //DownVote Decrease
                if (newVote == 1)       {ud = 1;} //UpVote Increase
                else if (newVote == -1) {dd = 1;} //DownVote Increase
                delta.push({aID: newAID, upDelta: ud, downDelta: dd});             
            }
            // Increment both Vote counters as they have been handled
            o++;
            n++;
        // There was no prior vote information on this new ID
        } else {
            var ud = 0;
            var dd = 0;
            if (newVote == 1)       {ud = 1;}  //UpVote Increase
            else if (newVote == -1) {dd = 1;}  //DownVote Increase
            delta.push({aID: newAID, upDelta: ud, downDelta: dd});  
            // Increment newVote to be checked    
            n++;
        }
    }
    return delta;
}

/**
 * @param  {Request} req express request
 * @param  {Response} res express response
 * @param  {function} next next function in chain to call
 */
var updateVotes = async function(req, res, next) {

    // Send 400 bad request if failed validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Request failed validation');
        return res.status(400).json({ errors: errors.array() })
    }

    console.log('Vote controller received a request to update votes');

    var user;
    var oldQuestionVotes;
    var oldAnswerVotes;
    var username = req.body['username'];
    var newQuestionVotes = req.body['questionVotes'] // [{qID: X, vote: Y}]
    var newAnswerVotes = req.body['answerVotes'] // [{aID: X, vote: Y}]
    var deltaQuestionVotes;
    var deltaAnswerVotes;

    (async function() {
        // console.log(`DEBUG Votes`);
        // console.log(`${JSON.stringify(req.body)}`);
        // console.log(`Username: ${username}`);
        // console.log(`New Question Votes: ${newQuestionVotes}`);
        // console.log(`New Answer Votes: ${newAnswerVotes}`);

        user = await userRepo.getUsers({username: username});
        // Check user exists
        if (user == null) {
            let msg1 = `There was an error get user from the database.`;
            console.log(msg1)
            return res.status(400).json({
                failure : msg1,
            });
        }

        oldQuestionVotes = await voteRepo.getQuestionVotes({userID: user.id});
        oldAnswerVotes = await voteRepo.getAnswerVotes({userID: user.id});

        deltaQuestionVotes = getChangedQuestionVotes(oldQuestionVotes, newQuestionVotes);
        deltaAnswerVotes = getChangedAnswerVotes(oldAnswerVotes, newAnswerVotes);

        //console.log(`${JSON.stringify(deltaQuestionVotes)}`);
        //console.log(`${JSON.stringify(deltaAnswerVotes)}`);

        deltaQuestionVotes.forEach(async (delta) => {
            await voteRepo.changeQuestionVote(delta, user.id);
        });

        deltaAnswerVotes.forEach(async (delta) => {
            await voteRepo.changeAnswerVote(delta, user.id);
        });

        let msg2 = `Votes updated`;
        console.log(msg2);
        return res.status(200).json({ 
            success : msg2,
        });
    })();
}

module.exports = {
    updateVotes,
    validatePostVotes,
};

