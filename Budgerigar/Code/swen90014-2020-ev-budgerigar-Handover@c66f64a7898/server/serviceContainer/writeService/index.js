const express = require('express');
const bodyParser = require('body-parser');

const questionController    = require(process.env.COMMON_PATH + 'controllers/questionController');
const answerController      = require(process.env.COMMON_PATH + 'controllers/answerController');
const linkController        = require(process.env.COMMON_PATH + 'controllers/linkController');
const userController        = require(process.env.COMMON_PATH + 'controllers/userController');
const voteController        = require(process.env.COMMON_PATH + 'controllers/voteController');

const app = express();
const PORT = process.env.INCOMING_PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Log request
app.post('*', (req, res, next) => {
    console.log(`Write service recieved POST request to ${req.url}`);
    next();
});

// POST a new question
app.post('/questions', questionController.validateCreateQuestion, questionController.createQuestion);

// POST an answer
app.post('/questions/:qID/answers', answerController.validateCreateAnswer, answerController.createAnswer);

// POST a link
app.post('/questions/:qID/links', linkController.validateCreateLink, linkController.createLink);

// Post votes
app.post('/users/:id/votes', voteController.validatePostVotes, voteController.updateVotes);

// Delete user
app.delete('/users/:id', userController.validateDeleteUser, userController.deleteUser);

// POST an MP verification request
app.post('/verify', userController.validateVerificationRequest, userController.sendVerificationEmail);

// POST an MP code
app.post('/verify/:code', userController.validateVerificationCode, userController.updateMPStatus);

app.listen(PORT, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log(`Express server listening on `+ add + `:${PORT}`)
     })
});