const queries = require('../../queries/queries');
const UserRepo = require('../userRepository.js');
const db = require('../../dbConnection');
const {seedUser1, testUser1} = require('../../jest/testObjects');

var userRepo;
var errUserRepo;
var seedUser;

userRepo = new UserRepo(db);
  
beforeAll( async () => {
	var uDetails = {username:seedUser1.username};
	seedUser = await userRepo.getUsers(uDetails);
});


describe('testing inserting a user', () => {
	
	test('inserting a new user', async () => {
		let user = await userRepo.insertUser(testUser1.username, testUser1.publicKey);
		expect(user).not.toBe(null);
	});
	
	test('inserting an existing user', async () => {
		// Verify user already exists
		let userDetails = {username: seedUser1.username}
		let check = await userRepo.getUsers(userDetails);
		expect(check).not.toBe(null);

		// Add existing user
		let user = await userRepo.insertUser(seedUser1.username, seedUser1.publicKey);
		expect(user).toBe(null);
	});
});

describe('testing getting a user', () => {   

    test('retrieving a user by username', async () => {
		let userDetails = {username: seedUser1.username};
        let user = await userRepo.getUsers(userDetails);
    	expect(user.username).toEqual(seedUser1.username);
    });

    test('retrieving a user that does not exist by username (returns null)', async () => {
		let userDetails = {username: 'doesnotexist'};
    	let user = await userRepo.getUsers(userDetails);
    	expect(user).toEqual(null);
	});
	
	test('retrieving a user by ID', async () => {
		// Retrieve user
		let usernameDetails = {username: seedUser1.username};
		let result = await userRepo.getUsers(usernameDetails);
		let id = result.id;
		let userIDDetails = {id: id};
		let user = await userRepo.getUsers(userIDDetails);
		expect(user.id).toEqual(id);
	});
	
	test('retrieving a user that does not exist by ID (returns null)', async () => {
		let userDetails = {id: 100000}
		let user = await userRepo.getUsers(userDetails);
		expect(user).toEqual(null);
	});

	test('retrieving a user by public key', async () => {
		let userDetails = {publicKey: seedUser1.publicKey};
		let user = await userRepo.getUsers(userDetails);
		expect(user.publicKey).toEqual(seedUser1.publicKey);
	});
	
	test('retriving multiple users', async () => {
		// Insert a second user
		await userRepo.insertUser(testUser1.username, testUser1.publicKey)
		
		let users = await userRepo.getUsers();
		expect(users).not.toBe(null);
	});
});

describe('testing updating a user', () => {  

	test("updating a user's username", async () => {
		let username = 'useruseruser';
		let updateDetails = {id:seedUser.id, username:username};
		let user = await userRepo.updateUser(updateDetails);

		expect(user.id).toEqual(seedUser.id)
		expect(user.username).toEqual(username)
	});

	test("updating a user's public key", async () => {
		let publicKey = 'publickey';
		let updateDetails = {id:seedUser.id, publicKey:publicKey};
		let user = await userRepo.updateUser(updateDetails);

		expect(user.id).toEqual(seedUser.id)
		expect(user.publicKey).toEqual(publicKey)
	});
	
	test("updating a user's email", async () => {
		let email = 'test@test.com';
		let updateDetails = {id:seedUser.id, email:email};
		let user = await userRepo.updateUser(updateDetails);

		expect(user.id).toEqual(seedUser.id)
		expect(user.email).toEqual(email)
	});

	test("updating a user's verification code", async () => {
		let code = '123456';
		let updateDetails = {id:seedUser.id, verificationCode:code}
		let user = await userRepo.updateUser(updateDetails);

		expect(user.verificationCode).toEqual(code)
	});
	
	test("updating a user's mp status", async () => {
		let mpStatus = true;
		let updateDetails = {id:seedUser.id, isMP:mpStatus}
		let user = await userRepo.updateUser(updateDetails)

		expect(user.isMP).toEqual(mpStatus)
	});

	test("updating email, verification code and mp status", async () => {
		let email = 'test@test.com';
		let code = '123456'
		let mpStatus = true;

		let updateDetails = {id:seedUser.id, email:email, isMP:mpStatus, verificationCode:code}
		let user = await userRepo.updateUser(updateDetails);

		expect(user.id).toEqual(seedUser.id)
		expect(user.email).toEqual(email)
		expect(user.verificationCode).toEqual(code)
		expect(user.isMP).toEqual(mpStatus)
	});

	test("attempting to update without passing an id", async () => {
		let email = 'test@test.com';
		let updateDetails = {email:email}
		let user = await userRepo.updateUser(updateDetails);

		expect(user).toBe(null);
	});

	test("attempting to update by passing an invalid id", async () => {
		let updateDetails = {id:-5}
		let user = await userRepo.updateUser(updateDetails);

		expect(user).toBe(null);
	});

	test("attempting to update without passing arguments", async () => {
		
		let user = await userRepo.updateUser();
		expect(user).toBe(null);
	});

});

describe('testing initalising userRepo without a correct database connection', () => {  

	beforeAll( async () => {
		errUserRepo = new UserRepo('not a db connection');
	});

    test('retrieving a user by username with incorrect db connection should fail', async () => {
		let userDetails = {username: seedUser1.username};		
		let user = await errUserRepo.getUsers(userDetails);
		expect(user).toBe(null);
	});

	test('inserting a user with incorrect db connection should fail', async () => {
        let user = await errUserRepo.insertUser(testUser1.username, testUser1.publicKey);
    	expect(user).toBe(null);
	});

	test('updating a user with incorrect db connection should fail', async () => {
        let code = '123456';
		let updateDetails = {id:seedUser.id, verificationCode:code}
		let user = await errUserRepo.updateUser(updateDetails);

		expect(user).toBe(null);
	});

});

