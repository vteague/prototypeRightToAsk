const { body, param, validationResult,} = require('express-validator');
const db                                = require('../dbConnection')
const UserRepository                    = require('../repositories/userRepository');
const validators                        = require('../validators/validators');
const generateCode                      = require('../utils/generateCode');

const DELETED_TEXT = "<deleted>";

const userRepo = new UserRepository(db);

// Set of validation functions to use before passing to business logic
var validateCreateUser = [
    body('username')
        .isLength({ min: 5 }).withMessage('must have minimum length of 5')
        .matches(/^[a-zA-Z0-9]+$/i).withMessage('must contain only alphanumeric characters')
        .custom((value, { req }) => validators.userValidators.validateUsernameAvailability(userRepo, value)),
        
    body('publicKey')
        .isLength({min:512, max: 512}).withMessage('must be of length 512')
        .isAlphanumeric().withMessage('must contain only alphanumeric characters')
        .custom((value, { req }) => validators.userValidators.validatePublicKeyAvailability(userRepo, value)),
];

/**
 * Creates a user
 * @param  {Request} req express request
 * @param  {Response} res express response
 * @param  {function} next next function in chain to call
 */
var createUser = async function(req, res, next) {

    // Send 400 bad request if failed validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Request failed validation');
        return res.status(400).json({ errors: errors.array() })
    }

    console.log('User controller recieved a request to create new user');
    
    var username = req.body['username'];
    var publicKey = req.body['publicKey'];
    
    (async function() {

        console.log(`Creating user with details 
            username:${username},    
            publicKey:${publicKey.substring(0, 20)}...`);

        let result = await userRepo.insertUser(username, publicKey);
        
        // Failed to insert user, likely as this user isn't unique
        if (result == null) {
            let msg1 = `Couldn't insert user '${username}' into database...but it passed validation. Something's up.`;
            console.log(msg1)
            return res.status(409).json({ 
                failure : msg1 
            });
        }
        
        // User successfully created
        console.log(`User ${username} successfully created`);
        return res.status(201).json({ 
            success : "User '" + username + "' successfully registered",
            details : result
        })
    })();
};

var validateVerificationRequest = [
    body('username')
        .custom((value, { req }) => validators.userValidators.validateUserExists(userRepo, value)),
    body('email')
        .isEmail().withMessage(`is not a valid email`)
        .custom((value, { req }) => validators.userValidators.validateGovEmail(value))
]

/**
 * Sends a verification email to check ownership of provided email account
 * @param  {Request} req express request
 * @param  {Response} res express response
 * @param  {function} next next function in chain to call
 */
var sendVerificationEmail = async function(req, res, next) {
    
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Request failed validation');
        return res.status(400).json({ errors: errors.array() })
    }

    console.log('User controller recieved a request to send a verification email via email utility');

    var to = req.body['email'];
    var username = req.body['username'];

    var code = generateCode();
    console.log(`Unique code generated for ${to}: ${code}`);

    //Store code in db
    var userDetails = {username: username};
    var user = await userRepo.getUsers(userDetails);
    
    userDetails.id = user.id;
    userDetails.email = to;
    userDetails.verificationCode = code;
    
    var result = await userRepo.updateUser(userDetails);

    if (result == null) {
        return res.status(400).json({
            failure : `Unable to update ${username}'s entry in the database`
        })
    }

    console.log(`User ${userDetails.id} : ${userDetails.username}'s email has been updated to ${userDetails.email}`);
    console.log(`User ${userDetails.id} : ${userDetails.username}'s code has been updated to ${userDetails.verificationCode}`);
    
    return res.status(200).json({
        email: to ,
        code: code,
    })

};

var validateVerificationCode = [
    body('username')
        .custom((value, { req }) => validators.userValidators.validateUserExists(userRepo, value)),
    param('code')
        .isLength({min: 6, max: 6}).withMessage('must have minimum length of 5')
        .isNumeric().withMessage('must be a number')
];

/**
 * Updates a user's status to MP
 * @param  {Request} req express request
 * @param  {Response} res express response
 * @param  {function} next next function in chain to call
 */
var updateMPStatus = async function(req, res, next) {

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Request failed validation');
        return res.status(400).json({ errors: errors.array() })
    }

    console.log(`User controller recieved a request to verify ${username} with code ${code}`);

    var code = req.params.code;
    var username = req.body['username'];


    var userDetails = {username: username};
    var user = await userRepo.getUsers(userDetails);

    console.log(`${username}'s code is ${user.verificationCode}`)

    // Check codes match
    if (user.verificationCode != null && user.verificationCode == code) {
        console.log(`User ${username} verified as MP`);

        user.isMP = true;
        var result = await userRepo.updateUser(user);
        console.log('Updating user, result is: ', result);

        return res.status(200).json({
            success : `User ${username} successfully verified as an MP`
        });
    } else {
        console.log(`Code ${code} did not match user's code ${user.verificationCode}`);
        return res.status(400).json({
            failure : `User ${username} could not be verified`
        });
    }
}


var validateDeleteUser = [
    body('username')
        .custom((value, { req }) => validators.userValidators.validateUserExists(userRepo, value))        
]

/**
 * Deletes a user from the server
 * @param  {Request} req express request
 * @param  {Response} res express response
 * @param  {function} next next function in chain to call
 */
var deleteUser = async function(req, res, next) {
    
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Request failed validation');
        return res.status(400).json({ errors: errors.array() })
    }

    let username = req.body['username'];

    console.log(`User controller recieved a request to delete ${username} from the database`);

    // Retrieve the user to update
    let uDetails = {username:username};
    let user = await userRepo.getUsers(uDetails);

    // Update the user
    uDetails = {id:user.id, username:DELETED_TEXT, email:DELETED_TEXT, publicKey:DELETED_TEXT, forClient:true}
    let updatedUser = await userRepo.updateUser(uDetails);

    // Update failed
    if (updatedUser == null || updatedUser.username != DELETED_TEXT) {
        let msg = `Failed to update user ${username} with ${DELETED_TEXT}`;
        console.log(msg);
        return res.status(500).json({
            failure : msg
        });
    }

    // Update succeeded
    let msg = `User ${username} now set as <deleted>`;
    console.log(msg);
    return res.status(200).json({
        success : msg,
        details : updatedUser
    });

}


module.exports = {
    createUser,
    validateCreateUser,
    sendVerificationEmail,
    validateVerificationRequest,
    updateMPStatus,
    validateVerificationCode,
    deleteUser,
    validateDeleteUser
}
