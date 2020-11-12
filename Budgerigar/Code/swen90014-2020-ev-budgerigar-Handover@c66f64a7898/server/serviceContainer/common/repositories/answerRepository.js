const queries = require('../queries/queries');
const Answer = require('../entities/Answer.js');
const UserRepository = require('./userRepository');
const { getQueryRow, getQueryRows } = require('../utils/parseQuery.js') 


module.exports = class AnswerRepository {

    constructor(dbClient) {
        this.db = dbClient;
    }


    /**
     * @param { {id} } int an answer id to return, if it exists
     * @param { {questionID} } int the question id to return all answers for
     * @returns {Answer} an answer object if answer id was given
     * @returns { [Answer] } a list of answer objects  if question id was given
     */
    async getAnswers({id=undefined, questionID=undefined, fromTime=undefined} = {} ) {

        var answers = [];
        var result;
        try {
            // Get an answer
            if (id != undefined) {
                result = await this.db.query(queries.getAnswer, [id]);
            }

            // Get all answers linked to a question
            else if (questionID != undefined) {
                result = await this.db.query(queries.getAnswersFromQuestion, [questionID]);
            }

            else if (fromTime != undefined) {
                result = await this.db.query(queries.getAnswersFromTime, [fromTime]);
            }

            else {
                console.log("No arguments given to getAnswers(), returning all answers");
                result = await this.db.query(queries.getAnswers, []);
            }

            if (result.rows === undefined || result.rows.length == 0) {
                // No results
                console.log("geAnswers() returned no results, returning null");
                return null;
            }

            // Searching for only one answer
            if (id != undefined) {
                return new Answer(getQueryRow(result));
            }
               
            getQueryRows(result).forEach( (row) => {
                answers.push(new Answer(row))
            });
            return answers;   
        

        } catch (err) {
            console.error(err)
            return null;
        } 
    }


    /**
     * Inserts an answer into the database, returning a new Answer object if successful, null if not.
     * @param  {int} questionID ID of question being answered
     * @param  {int} userID ID of user posting the answer
     * @param  {string} message the user's answer
     */
    async insertAnswer(questionID, userID, message) {
        try {
            let result = await this.db.query(queries.insertAnswer, [questionID, userID, message]);
            return new Answer(getQueryRow(result));

        } catch (err) {
            console.error(err)
            return null;
        }
    }
}
