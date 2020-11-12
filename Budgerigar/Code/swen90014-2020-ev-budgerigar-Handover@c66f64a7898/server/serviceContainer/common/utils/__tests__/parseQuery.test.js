const { getQueryRow, getQueryRows } = require('../../utils/parseQuery.js') 
const queries                       = require('../../queries/queries');
const db                            = require('../../dbConnection');
const {seedUser1}                   = require('../../jest/testObjects');
  
describe('testing parseQueryRow', () => {
	
	test('parsing a query with one row', async () => {
        var query = await db.query(queries.getUserFromName, [seedUser1.username]);
        var parsedRow = getQueryRow(query);
        expect(parsedRow.username).toEqual(seedUser1.username)
    });

    test('parsing a query with multiple rows', async () => {
		var query = await db.query(queries.getUsers, []);
        var parsedRow = getQueryRow(query);
        expect(parsedRow.id).not.toEqual(undefined);
    });

    test('parsing a query with no rows', async () => {
        var query = await db.query(queries.getAnswersFromTime, ["3020-10-19T02:08:39.871Z"]);
        var parsedRow = getQueryRow(query);
        expect(parsedRow).toBe(null);
    });

});

describe('testing parseQueryRows', () => {

    test('parsing a query with one row', async () => {
		var query = await db.query(queries.getUsers, []);
        var parsedRows = getQueryRows(query);
        expect(parsedRows.length == 1).toEqual(true);
    });
    
    test('parsing a query with multiple rows', async () => {
		var query = await db.query(queries.getQuestions, []);
        var parsedRows = getQueryRows(query);
        expect(parsedRows.length > 0).toEqual(true);
    });

    test('parsing a query with no rows', async () => {
        var query = await db.query(queries.getAnswersFromTime, ["3020-10-19T02:08:39.871Z"]);
        var parsedRows = getQueryRows(query);
        expect(parsedRows.length == 0).toEqual(true);
    });

});