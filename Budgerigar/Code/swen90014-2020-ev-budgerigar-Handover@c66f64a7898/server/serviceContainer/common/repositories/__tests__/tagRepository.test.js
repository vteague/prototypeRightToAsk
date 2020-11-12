const TagRepo = require('../tagRepository.js');
const UserRepo = require('../userRepository.js');
const QuestionRepo = require('../questionRepository.js');
const db = require('../../dbConnection');
const {seedUser1, seedQ1, seedTag1, testTag1, testTag2} = require('../../jest/testObjects');

var tagRepo;
var questionRepo;
var userRepo;
var errTagRepo;

var seedUser;
var seedQuestion;
var seedTag;

beforeAll( async () => {
    tagRepo = new TagRepo(db);
    userRepo = new UserRepo(db);
    questionRepo = new QuestionRepo(db);

    // For testing a tag repository initalised with a wrong db connection
    errTagRepo = new TagRepo('not a db connection');

    // Get seeded user 1
    var uDetails = {username:seedUser1.username}
    seedUser = await userRepo.getUsers(uDetails);
    console.log("Got seed user:", seedUser);

    // Get seeded question 1
    seedQuestion = await questionRepo.insertQuestion(seedUser.id, seedQ1.message, 'testsig');
    console.log("Got seed question:", seedQuestion);


    // Get seeded tag
    seedTag = await tagRepo.insertTag(seedTag1.tag);
    console.log("Got seed tag", seedTag);

});
  
describe('testing inserting a tag', () => {
	
	test('inserting a new tag', async () => {
    
        var tag = await tagRepo.insertTag(testTag1.tag);
        expect(tag).not.toBe(null);
	});
    
    test('inserting multiple tags', async () => {

        await tagRepo.insertTag(testTag1.tag);
        let tag = await tagRepo.insertTag(testTag2.tag);

		expect(tag).not.toBe(null);
	});
});

describe('testing getting tags', () => {   

    test('retrieving a tag by ID', async () => {
 
        var tag = await tagRepo.getTags(seedTag);
    	expect(tag).not.toBe(null);
    });

    test('retrieving a tag by tag', async () => {
 
        let tagDetails = {tag:seedTag.tag}
        var tag = await tagRepo.getTags(tagDetails);
    	expect(tag.tag).toEqual(tagDetails.tag);
    });

    test('retrieving a non-existant tag (returns null)', async () => {
		let tagDetails = {id: 100000};
        var tag = await tagRepo.getTags(tagDetails);
    	expect(tag).toBe(null);
	});
	
	test('retrieving all tags', async () => {
        await tagRepo.insertTag(testTag1.tag);
        await tagRepo.insertTag(testTag1.tag);
        await tagRepo.insertTag(testTag1.tag);

        var tags = await tagRepo.getTags();
		expect(tags.length > 0).toBe(true);
    });

    test('retrieving tags based on question ID', async () => {

        var tag1 = await tagRepo.insertTag(testTag1.tag);
        var tag2 = await tagRepo.insertTag(testTag2.tag);

        await tagRepo.linkTagToQuestion(tag1.id, seedQuestion.id);
        await tagRepo.linkTagToQuestion(tag2.id, seedQuestion.id);
        await tagRepo.linkTagToQuestion(seedTag.id, seedQuestion.id);

        var tDetails = {questionID: seedQuestion.id};
        var tags = await tagRepo.getTags(tDetails);

        expect(tags.length > 0).toBe(true);  
    });
});

describe('testing inserting a tag link', () => {  

    test('inserting a tag link', async () => {		
        
        let tagLink = await tagRepo.linkTagToQuestion(seedTag.id, seedQuestion.id);
        expect(tagLink.tagID).toEqual(seedTag.id);
        expect(tagLink.questionID).toEqual(seedQuestion.id);        
    });
    
    test('inserting a tag link that already exists should fail', async () => {		
        await tagRepo.linkTagToQuestion(seedTag.id, seedQuestion.id);
        let tagLink = await tagRepo.linkTagToQuestion(seedTag.id, seedQuestion.id);

		expect(tagLink).toBe(null);
	});

	test('inserting a tag link with non-existant tag id should fail', async () => {
        
        let tagLink = await tagRepo.linkTagToQuestion(seedTag.id, -5);
    	expect(tagLink).toBe(null);
    });
    
    test('inserting a tag link with non-existant question id should fail', async () => {
        
        let tagLink = await tagRepo.linkTagToQuestion(-5, seedQuestion.id);
    	expect(tagLink).toBe(null);
	});
});

describe('testing initalising tagRepo without a correct database connection', () => {  

    test('retrieving a tag with incorrect db connection should fail', async () => {		
       
        let tag = await errTagRepo.getTags(seedTag);
		expect(tag).toBe(null);
	});

	test('inserting a tag with incorrect db connection should fail', async () => {
        
        let tag = await errTagRepo.insertTag(testTag1.tag);
    	expect(tag).toBe(null);
	});
});