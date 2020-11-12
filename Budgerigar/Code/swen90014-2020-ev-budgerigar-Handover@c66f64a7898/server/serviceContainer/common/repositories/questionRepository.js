const queries = require('../queries/queries');
const Question = require('../entities/Question.js');
const UserRepository = require('./userRepository');
const { getQueryRow, getQueryRows } = require('../utils/parseQuery.js') 


module.exports = class QuestionRepository {

    constructor(dbClient) {
        this.db = dbClient;
    }

    
    /**
     * Returns question objects from the database if they exist, null if not. 
     * @param  { {id} } int (optional) the id to query for
     * @returns a question matching the id provided
     * @returns all questions if no id provided
     * @returns null if no matches found
     */
    async getQuestions( {id=undefined, fromTime=undefined} = {}) {
        
        var questions = [];
        var result;

        try {
            if (id != undefined) {
                result = await this.db.query(queries.getQuestion, [id]);
            }
            
            else if (fromTime != undefined) {
                result = await this.db.query(queries.getQuestionsFromTime, [fromTime]);
            }
            // Get all questions
            else {
                result = await this.db.query(queries.getQuestions);
            }

            if (result.rows === undefined || result.rows.length == 0) {
                // No results
                console.log("getQuestions() returned no results, returning null");
                return null;
            }

            // Return only one question
            if (id != undefined) {
                return new Question(getQueryRow(result));
            }

            getQueryRows(result).forEach( (row) => questions.push(new Question(row) ));
            return questions;

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * Inserts a question into the database, returning a new Question object if successful, null if not.
     * @param  {string} userID ID of user posting question
     * @param  {string} message the user's question
     */
    async insertQuestion(userID, message) {
        try {
            let result = await this.db.query(queries.insertQuestion, [userID, message]);

            return new Question(getQueryRow(result));
            

        } catch (err) {
            console.error(err)
            return null;
        }
    }
}