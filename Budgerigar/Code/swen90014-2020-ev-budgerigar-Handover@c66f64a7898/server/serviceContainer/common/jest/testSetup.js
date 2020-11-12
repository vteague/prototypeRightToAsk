const testObjects = require('./testObjects');
const db = require('../dbConnection');
const queries = require('../queries/queries');

global.beforeAll( async () => {

    console.log("Dropping all rows...");
    // Clear database
    await db.query(queries.deleteAllTagLinkRows);
    await db.query(queries.deleteAllTagRows);
    await db.query(queries.deleteAllLinkRows);
    await db.query(queries.deleteAllAnswerRows);
    await db.query(queries.deleteAllQuestionRows);
    await db.query(queries.deleteAllUserRows);
    console.log("All rows deleted");

    // Seed db with user
    var u = await db.query(queries.insertUser, [testObjects.seedUser1.username, testObjects.seedUser1.publicKey]);
    var seedUser = u.rows[0];

    // Seed db with questions
    var q1 = await db.query(queries.insertQuestion, [seedUser.id, testObjects.seedQ1.message]);
    var q2 = await db.query(queries.insertQuestion, [seedUser.id, testObjects.seedQ2.message]);
    var seedQuestion1 = q1.rows[0];
    var seedQuestion2 = q2.rows[0];

    // Seed db with answers
    var seedAnswer1 = await db.query(queries.insertAnswer, [seedQuestion1.id, seedUser.id, testObjects.seedA1.message]);
    var seedAnswer2 = await db.query(queries.insertAnswer, [seedQuestion1.id, seedUser.id, testObjects.seedA1.message]);
    var seedAnswer3 = await db.query(queries.insertAnswer, [seedQuestion2.id, seedUser.id, testObjects.seedA1.message]);

});

global.afterAll( async () => {
    await db.end();
    return;
});

global.beforeEach( async () => {
    await db.query('START TRANSACTION');
    return;
});
  
global.afterEach( async () => {
    await db.query('ROLLBACK');
    return;
});