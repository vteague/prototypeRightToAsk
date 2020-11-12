const { body, validationResult, param}  = require('express-validator');
const db                                = require('../dbConnection')
const QuestionRepository                = require('../repositories/questionRepository');
const LinkRepository                    = require('../repositories/linkRepository');
const validators                        = require('../validators/validators');
const QuestionValidators                = require('../validators/questionValidators');
const LinkValidators                    = require('../validators/linkValidators');

const questionRepo = new QuestionRepository(db);
const linkRepo = new LinkRepository(db);

// Set of validation functions to use before passing to business logic
var validateCreateLink = [
    param('qID').custom((value, { req }) => validators.questionValidators.validateQuestionID(questionRepo, value)),
    body('link').custom((value, { req }) => validators.linkValidators.validateHansardDocumentExists(value))
];

/**
 * @param  {Request} req express request
 * @param  {Response} res express response
 * @param  {function} next next function in chain to call
 */
var createLink = async function(req, res, next) {

    // Send 400 bad request if failed validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Request failed validation');
        return res.status(400).json({ errors: errors.array() })
    }

    console.log('Link controller received a request to create new link');

    var qID = req.params.qID;
    var link;
    var url = req.body['link'];

    (async function() {

        console.log(`Creating link with details 
            qID:${qID},    
            link:${url}`); 

        link = await linkRepo.insertLink(qID, url);

        // Check link was inserted
        if (link == null) {
            let msg1 = `There was an error inserting the link into the database.`;
            console.log(msg1)
            return res.status(400).json({
                failure : msg1,
            });
        }

        let msg2 = `Link ${url} successfully added to question ${qID}`;
        console.log(msg2);
        return res.status(200).json({ 
            success : msg2,
            details : link
        });
    })();
}

module.exports = {
    createLink,
    validateCreateLink,
};

