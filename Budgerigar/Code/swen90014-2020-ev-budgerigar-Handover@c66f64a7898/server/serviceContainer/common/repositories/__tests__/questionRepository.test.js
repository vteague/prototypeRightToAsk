const UserRepo = require('../userRepository.js');
const QuestionRepo = require('../questionRepository.js');
const db = require('../../dbConnection');
const {seedUser1, testQ1} = require('../../jest/testObjects');

var userRepo = new UserRepo(db);
var questionRepo = new QuestionRepo(db);
var seedUser;

var errQuestionRepo;

beforeAll( async () => {
    // Get seeded user
    var userDetails = {username: seedUser1.username};
    seedUser = await userRepo.getUsers(userDetails);
});
  
describe('testing inserting a question', () => {
	
	test('inserting a new question', async () => {
    
        var question = await questionRepo.insertQuestion(seedUser.id, testQ1.message);
        expect(question).not.toBe(null);
	});
	
	test('inserting a question with a non-existing user', async () => {

		let question = await questionRepo.insertQuestion(100000, testQ1.message);
		expect(question).toBe(null);
    });
    
    test('inserting multiple questions', async () => {

        await questionRepo.insertQuestion(seedUser.id, testQ1.message);
        await questionRepo.insertQuestion(seedUser.id, testQ1.message);
        let question = await questionRepo.insertQuestion(seedUser.id, testQ1.message);
		expect(question).not.toBe(null);
	});
});

describe('testing getting questions', () => {   

    test('retrieving a question by ID', async () => {
        var q1 = await questionRepo.insertQuestion(seedUser.id, testQ1.message);
        var qDetails = {id: q1.id};
        var q2 = await questionRepo.getQuestions(qDetails);
    	expect(q1).toEqual(q2);
    });

    test('retrieving a non-existant question (returns null)', async () => {
		let qDetails = {id: 100000};
        var q = await questionRepo.getQuestions(qDetails);
    	expect(q).toBe(null);
	});
	
	test('retrieving multiple questions', async () => {
        await questionRepo.insertQuestion(seedUser.id, testQ1.message);
        await questionRepo.insertQuestion(seedUser.id, testQ1.message);
        await questionRepo.insertQuestion(seedUser.id, testQ1.message);

        var questions = await questionRepo.getQuestions();
		expect(questions).not.toBe(null);
    });
});

describe('testing initalising questionRepo without a correct database connection', () => {  

	beforeAll( async () => {
		errQuestionRepo = new QuestionRepo('not a db connection');
	});

    test('retrieving a question with incorrect db connection should fail', async () => {		
        let qDetails = {id: 1};
        let q = await errQuestionRepo.getQuestions(qDetails);
		expect(q).toBe(null);
	});

	test('inserting a question with incorrect db connection should fail', async () => {
        
        let q = await errQuestionRepo.insertQuestion(seedUser.username, testQ1.message);
    	expect(q).toBe(null);
	});
});