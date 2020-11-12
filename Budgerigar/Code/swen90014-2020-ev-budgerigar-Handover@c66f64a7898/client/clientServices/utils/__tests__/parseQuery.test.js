// const queries = require('../../queries/queries');
// const db = require('../../dbConnection');
// const {testUser1, testUser2} = require('../../jest/testObjects');

// beforeAll( async () => {
	
// 	// Clear test database of users
// 	await db.query(queries.deleteAllUserRows, [])

// 	// Seed with test user 1
// 	await db.query(queries.insertUser, [testUser1.username, testUser1.publicKey]);
// 	console.log("Test User 1 added");
    
//     // Seed with test user 2
//     await db.query(queries.insertUser, [testUser2.username, testUser2.publicKey]);
// 	console.log("Test User 2 added");
//     return;
// });

// afterAll( async () => {
// 	await db.query(queries.deleteAllUserRows, [])
// 	await db.end();
// 	return;
// });

// // Wrap each test in a rolled back transaction for safety
// beforeEach( () => {
//     return db.query('START TRANSACTION');
// });

// afterEach( () => {
//     return db.query('ROLLBACK');
// });
  
// describe('testing parseQueryRow', () => {
	
// 	test('parsing a query with one row', async () => {
// 		query = await db.query(queries.)
//     });

//     test('parsing a query with multiple rows', async () => {
		
//     });

//     test('parsing a query with no rows', async () => {
		
//     });

// });

// describe('testing parseQueryRows', () => {

//     test('parsing a query with multiple rows', async () => {
		
//     });

//     test('parsing a query with no rows', async () => {
		
//     });

// });