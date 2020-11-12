const validators = {};

validators.userValidators       = require('./userValidators')
validators.questionValidators   = require('./questionValidators');
validators.answerValidators     = require('./answerValidators');
validators.linkValidators       = require('./linkValidators');

module.exports = validators;