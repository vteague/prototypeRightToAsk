const queries = require('../queries/queries');
const Question = require('../entities/Question.js');
const QuestionVote = require('../entities/QuestionVote.js');

const { getQueryRow, getQueryRows } = require('../utils/parseQuery.js') 


module.exports = class QuestionRepository {

    constructor(dbClient) {
        this.db = dbClient;
    }
    
    /**
     * Returns question objects from the database if they exist, null if not. 
     * @param  { {id} } int (optional) the id to query for
     * @returns a question matching the id provided
     * @returns a list of all questions if no id provided
     * @returns null if no matches found
     */
    async getQuestions( {id=undefined} = {}) {
        
        var questions = [];
        var result;

        try {
            if (id != undefined) {
                result = await this.db.query(queries.getQuestion, [id]);
            }
            // Get all questions
            else {
                result = await this.db.query(queries.getQuestions);
            }


            if (!Array.isArray(result.rows) || !result.rows.length) {
                console.log("No results returned from getQuestions, returning empty list")
                return questions;
            }
            
            // Only one question
            if (id != undefined) {
                return new Question(getQueryRow(result));
            }
              
            // console.log("Result of getQuestion(): ", result);
            getQueryRows(result).forEach( (row) =>
                questions.push(new Question(row))
            );

            return questions;

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    async getVotes() {
        var votes = [];
        var result;

        try {
            result = await this.db.query(queries.getQuestionVotes);

            if (!Array.isArray(result.rows) || !result.rows.length) {
                return votes;
            }
            
            getQueryRows(result).forEach( (row) =>
                votes.push(new QuestionVote(row))
            );

            return votes;
        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * Inserts an question vote into the database, returning true if successful, false if not.
     * @param  {int} id ID of question
     * @param  {int} vote The vote being inserted
     * @returns  {boolean} result success or failure
     */
    async updateVote(id, vote) {
        try {
            await this.db.query(queries.modifyQuestionVote, [vote, id]);
            return true;
        } catch (err) {
            console.error(err)
            return false;
        }
    }

    /**
     * Inserts a question into the database, returning a new Question object if successful, null if not.
     * @param  {int} id ID of the question to insert
     * @param  {int} userID ID of user posting question
     * @param  {string} message the user's question
     * @param  {string} signature the user's signature
     */
    async insertQuestion(id, userID, message, upVotes, downVotes, dateCreated, lastModified) {
        try {
            let q = await this.getQuestions({id: id});
            // console.log("q: ", q);
            if (q.id == undefined) {
                await this.db.query(queries.insertQuestion, [id, userID, message, upVotes, downVotes, dateCreated, lastModified]);
            } else {
                await this.db.query(queries.updateQuestion, [message, upVotes, downVotes, lastModified, id]);
            }

            let questionDetails = {id: id};
            let question = await this.getQuestions(questionDetails);
            return question;

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    async updateTable(data) {
        if(data == null) return;
        console.log("question data not null")
        for (const elem of data) {
            await this.insertQuestion(elem['id'], elem['userID'], elem['message'], elem['upVotes'], elem['downVotes'], elem['dateCreated'], elem['lastModified']);
        }
    }
}