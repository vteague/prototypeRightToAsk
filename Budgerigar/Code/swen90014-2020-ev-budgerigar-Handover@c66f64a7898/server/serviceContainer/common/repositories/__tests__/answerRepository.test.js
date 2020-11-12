const UserRepo = require('../userRepository.js');
const QuestionRepo = require('../questionRepository.js');
const AnswerRepo = require('../answerRepository.js');
const db = require('../../dbConnection');
const {seedUser1, testA1} = require('../../jest/testObjects');

// Repositories
var userRepo = new UserRepo(db);
var questionRepo = new QuestionRepo(db);
var answerRepo = new AnswerRepo(db);

// Bad repo
var errAnswerRepo = new AnswerRepo('not a db connection');

// Seed objects
var seedUser;
var seedQuestion;
var seedAnswer;

beforeAll( async () => {

    // Get seeded user
    var userDetails = {username: seedUser1.username};
    seedUser = await userRepo.getUsers(userDetails);
    
    // Get a seeded question
    var qResults = await questionRepo.getQuestions();
    seedQuestion = qResults[0];

    // Get a seeded answer
    var aDetails = {questionID: seedQuestion.id};
    var aResults = await answerRepo.getAnswers(aDetails);
    seedAnswer = aResults[0];

});
  
describe('testing inserting an answer', () => {
	
	test('inserting a new answer', async () => {
        var answer = await answerRepo.insertAnswer(seedQuestion.id, seedUser.id, testA1.message);
        expect(answer).not.toBe(null);
	});
	
	test('inserting an answer with a non-existant question', async () => {
		let answer = await answerRepo.insertAnswer(1000000, seedUser.id, testA1.message);
		expect(answer).toBe(null);
    });

    test('inserting an answer with a non-existant user', async () => {
        let answer = await answerRepo.insertAnswer(seedQuestion.id, 1000000, testA1.message);
		expect(answer).toBe(null);
    });
    
    test('inserting multiple answers', async () => {

        await answerRepo.insertAnswer(seedQuestion.id, seedUser.id, testA1.message);
        await answerRepo.insertAnswer(seedQuestion.id, seedUser.id, testA1.message);
        await answerRepo.insertAnswer(seedQuestion.id, seedUser.id, testA1.message);
        var answer = await answerRepo.insertAnswer(seedQuestion.id, seedUser.id, testA1.message);

		expect(answer).not.toBe(null);
    });
});

describe('testing getting answers', () => {   

    test('retrieving an answer by ID', async () => {
        var aDetails = {id: seedAnswer.id};
        var a = await answerRepo.getAnswers(aDetails);
    	expect(a).toEqual(seedAnswer);
    });

    test('retrieving a non-existant answer (returns null)', async () => {
		let aDetails = {id: 10000000};
        var a = await answerRepo.getAnswers(aDetails);
    	expect(a).toBe(null);
	});
	
	test('retrieving multiple answers', async () => {
        await answerRepo.insertAnswer(seedQuestion.id, seedUser.id, testA1.message);
        await answerRepo.insertAnswer(seedQuestion.id, seedUser.id, testA1.message);
        await answerRepo.insertAnswer(seedQuestion.id, seedUser.id, testA1.message);

        var aDetails = {questionID: seedQuestion.id};
        var answers = await answerRepo.getAnswers(aDetails);
        expect(answers).not.toBe(null);
        expect(answers.length > 1).toBe(true);
    });

    test('calling getAnswers without any arguments (returns all answers)', async () => {
        var a = await answerRepo.getAnswers();
    	expect(a.length > 0).toBe(true);
	});
});

describe('testing initalising answerRepo without a correct database connection', () => {  

    test('retrieving an answer with incorrect db connection should fail', async () => {		
        let aDetails = {id: seedAnswer.id};
        let a = await errAnswerRepo.getAnswers(aDetails);
		expect(a).toBe(null);
	});

	test('inserting an answer with incorrect db connection should fail', async () => {
        
        let a = await errAnswerRepo.insertAnswer(seedQuestion.id, seedUser.id, testA1.message);
    	expect(a).toBe(null);
	});
});