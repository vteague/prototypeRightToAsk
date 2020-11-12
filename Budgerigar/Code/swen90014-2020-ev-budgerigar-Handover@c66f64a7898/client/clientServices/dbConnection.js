import * as SQLite from 'expo-sqlite';
import queries from './queries/queries.js'

function sql_success(str, tx, out) {
    console.log(`### ${str} ###`);
    console.log(JSON.stringify(out))
    console.log(`#################`);
}

function sql_error(tx, error) {
    console.log(`####  ERROR  ####`);
    console.log(error);
    console.log(`#################`);
}

const db = {};

console.log("##### DATABASE #####")
if (!global.TEST) {
    console.log("Using client.db");
    db.connection = SQLite.openDatabase('client.db');
}
else {
    console.log("Using testClient.db");
    db.connection = SQLite.openDatabase('testClient.db');
}

db.execute = function(sqlStatement, args = []) {
    return new Promise((resolve, reject) => {
        db.connection.exec([{sql: sqlStatement, args}], false, (err, res) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            
            if (res[0].error) {
                console.log(res[0].err);
                return reject(res[0].error);
            }
            // console.log("query 'res': ", res);

            resolve(res[0]);
        });
    });
}

db.query = async function(sqlQuery, args = []) {
    // console.log("Sending query: ", sqlQuery, "with args: ", args);

    return await db.execute(sqlQuery, args);
}

db.initDB = async function() {
    await db.query(queries.createUsers, []);
    await db.query(queries.createQuestions, []);
    await db.query(queries.createAnswers, []);
    await db.query(queries.createLinks, []);
    await db.query(queries.createTag, []);
    await db.query(queries.createTags, []);
}

db.debugPrintDB = function() {
    db.connection.transaction(tx => {
        tx.executeSql(`SELECT * FROM questions;`, [], (a, b) => sql_success("QUESTIONS", a, b), sql_error);
        tx.executeSql(`SELECT * FROM answers;`, [], (a, b) => sql_success("ANSWERS", a, b), sql_error);
        tx.executeSql(`SELECT * FROM links;`, [], (a, b) => sql_success("LINKS", a, b), sql_error);
        tx.executeSql(`SELECT * FROM tag;`, [], (a, b) => sql_success("TAG", a, b), sql_error);
        tx.executeSql(`SELECT * FROM tags;`, [], (a, b) => sql_success("TAGS", a, b), sql_error);
        tx.executeSql(`SELECT * FROM users;`, [], (a, b) => sql_success("USERS", a, b), sql_error);
    });
}

db.deleteDB = async function() {
    await db.query(queries.dropTag, []);
    await db.query(queries.dropTags, []);
    await db.query(queries.dropLinks, []);
    await db.query(queries.dropAnswers, []);
    await db.query(queries.dropQuestions, []);
    await db.query(queries.dropUsers, []);
}

module.exports = db;



