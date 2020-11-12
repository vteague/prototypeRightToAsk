const db = require('../dbConnection');
const UserRepository = require('./userRepository');
const answerRepository = require('./answerRepository');
const linkRepository = require('./linkRepository');
const questionRepository = require('./questionRepository');
const tagRepository = require('./tagRepository');

export const userRepo = new UserRepository(db);
export const answerRepo = new answerRepository(db);
export const linkRepo = new linkRepository(db);
export const questionRepo = new questionRepository(db);
export const tagRepo = new tagRepository(db);