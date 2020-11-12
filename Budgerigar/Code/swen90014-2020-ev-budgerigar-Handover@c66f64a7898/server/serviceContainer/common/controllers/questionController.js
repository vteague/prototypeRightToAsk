const { body, param, validationResult}  = require('express-validator');
const db                                = require('../dbConnection');
const UserRepository                    = require('../repositories/userRepository');
const QuestionRepository                = require('../repositories/questionRepository');
const TagRepository                     = require('../repositories/tagRepository');
const validators                        = require('../validators/validators');

const userRepo = new UserRepository(db);
const questionRepo = new QuestionRepository(db);
const tagRepo = new TagRepository(db);

// Set of validation functions to use before passing to business logic
var validateCreateQuestion = [
    body('username').custom( (value) => validators.userValidators.validateUserExists(userRepo, value)),    
    body('message').isLength({ min: 10 }).withMessage("message must be at least 10 chars long"),
    body('tags.*')
        .isLength({ max: 32 }).withMessage("tags must not be longer than 32 chars")
        .isAlpha().withMessage('must contain only characters a-z and A-Z')
];

var createQuestion = (req, res) => {
    // Send 400 bad request if failed validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Request failed validation');
        return res.status(400).json({ errors: errors.array() })
    }

    console.log('Question controller received a request to test new functions');

    var username = req.body['username'];
    var message = req.body['message'];
    var tags = req.body['tags'];

    (async function() {
        // Get user_id
        var userDetails = {username: username};
        var user = await userRepo.getUsers(userDetails);
        var userID = user.id;     

        console.log(`Creating question with details 
            userID:${userID},
            username:${username},    
            message:${message.substring(0, 20)}...,
            tags: ${tags}`);


        // Insert question, assign resulting entry to question
        var question = await questionRepo.insertQuestion(userID, message);

        // Check question was inserted
        if (question == null) {
            let msg1 = `There was an error inserting the answer into the database.`;
            console.log(msg1)
            return res.status(500).json({
                failure : msg1,
            });
        } 

        var createdTags = [];
        var tagSuccess = true;

        if (tags != undefined) {
            // Handle each tag in parallel...will this cause any issues?
            await Promise.all(tags.map(async (tagText) => {
                var tagDetails = {tag:tagText};
                try {
                    var tag = await tagRepo.getTags(tagDetails);
                    
                    if (tag != null) {
                        console.log(`Found tag: `, tag);
                    }

                    else {
                        console.log(`Tag '${tagText}' doesn't exist, creating new tag`);
                        tag = await tagRepo.insertTag(tagText);
                        console.log(`Tag created: `, tag);
                    }

                    // We have our tag, create a link
                    if (tag != null) {
                        await tagRepo.linkTagToQuestion(tag.id, question.id);

                        console.log(`${tag.tag} created and linked to question ${question.message.substring(0,20)}...`)
                        createdTags.push(tag);
                    }

                    // Somethings gone wrong with both getting and inserting a tag
                    else {
                        console.log(`Unable to get or insert tag '${tagText}'`);
                        return Promise.reject();
                    }
                } catch (err) {
                    console.error(err);
                    return Promise.reject();
                }
            })).then( values => {
                tagSuccess = true;
                console.log(`All tags valid and handled correctly`);
            }).catch( error => {
                console.log(`Encountered error while handling tags`);
                console.error(error);
                tagSuccess = false;
            });
        }

        /**
         * TO DO: Refactor to use Unit of Work design pattern to allow for transcation rollback
         * OR: Refactor repos to not use simple query, and instead each maintain a connection to the db
         */
        if (!tagSuccess) {
            var qDetails = {id:question.id};
            await questionRepo.deleteQuestion(qDetails);
            console.log(`Question: ${question} deleted from db`);
            var msg = "Server was unable to add tags correctly, so the question wasn't saved";
            console.log(msg);

            res.status(500).json({
                failure : msg
            })
        }

        // Attach tags to question if they exist
        if (tags != undefined) {
            question.tags = createdTags;
        }

        msg = `Question '${question.message.substring(0, 10)}...' successfully posted by user ${username}`;
        console.log(msg);
        res.status(200).json({ 
            success : msg,
            details : question
        });
    })();
}

module.exports = {
    createQuestion,
    validateCreateQuestion
};