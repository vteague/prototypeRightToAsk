const { body, param, validationResult}  = require('express-validator');
const db                                = require('../dbConnection');
const UserRepository                    = require('../repositories/userRepository');
const QuestionRepository                = require('../repositories/questionRepository');
const AnswerRepository                  = require('../repositories/answerRepository');
const validators                        = require('../validators/validators');

const userRepo = new UserRepository(db);
const questionRepo = new QuestionRepository(db);
const answerRepo = new AnswerRepository(db);

// Set of validation functions to use before passing to business logic
var validateCreateAnswer = [
    param('qID').custom((value, { req }) => validators.questionValidators.validateQuestionID(questionRepo, value)),    
    body('username').custom((value, { req }) => validators.userValidators.validateUserExists(userRepo, value)),
    body('message').isLength({ min: 5 }).withMessage('must have minimum length of 5')
];

var createAnswer = function(req, res) {

    // Send 400 bad request if failed validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Request failed validation');
        return res.status(400).json({ errors: errors.array() })
    }

    console.log('Answer controller received a request to create new answer');

    var qID = req.params.qID;
    var username = req.body['username'];
    var message = req.body['message'];


    (async function() {

        // Get user_id
        var userDetails = {username: username};
        var user = await userRepo.getUsers(userDetails);
        var userID = user.id;

        console.log(`Creating answer with details 
            qID:${qID},    
            userID:${userID}, 
            message:${message.substring(0, 20)}`);

        // Insert question, assign resulting entry to answer
        var answer = await answerRepo.insertAnswer(qID, userID, message);

        // Check that answer was inserted
        if (answer == null) {
            let msg1 = `There was an error inserting the answer into the database.`;
            console.log(msg1)
            return res.status(400).json({
                failure : msg1,
            });
        }

        let msg = `Answer ${answer.message.substring(0, 20)} successfully inserted`;
        console.log(msg);
        return res.status(200).json({ 
            success : msg,
            details : answer
        });
    })();
}

module.exports = {
    validateCreateAnswer,
    createAnswer
}