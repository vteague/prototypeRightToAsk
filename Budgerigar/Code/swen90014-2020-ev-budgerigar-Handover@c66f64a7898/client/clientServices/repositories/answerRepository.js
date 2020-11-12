const queries = require('../queries/queries');
const Answer = require('../entities/Answer.js');
const AnswerVote = require('../entities/AnswerVote.js');
const UserRepository = require('./userRepository');
const { getQueryRow, getQueryRows } = require('../utils/parseQuery.js') 

// TODO -> change getAnswers to always return a list

module.exports = class AnswerRepository {

    constructor(dbClient) {
        this.db = dbClient;
        this.userRepo = new UserRepository(this.db);
    }

    /**
     * Pass in a object with details specified, eg: getAnswers( { id:5 } )
     * @param { {id} } int an answer id to return, if it exists
     * @param { {questionID} } int the question id to return all answers for
     * @returns {Answer} an answer object if answer id was given
     * @returns { [Answer] } a list of answer objects  if question id or no argument was given
     */
    async getAnswers({id=undefined, questionID=undefined} = {} ) {

        var answers = [];
        var result;

        try {
            // Get an answer
            if (id != undefined) {
                result = await this.db.query(queries.getAnswer, [id]);
            }

            // Get all answers linked to a question
            else if (questionID != undefined) {
                result = await this.db.query(queries.getAnswersFromQuestionID, [questionID]);
            }

            else {
                console.log("No arguments given to getAnswers(), returning all answers");
                result = await this.db.query(queries.getAnswers, []);
            }

            
            if (!Array.isArray(result.rows) || !result.rows.length) {
                console.log("getAnswers() returned no results, returning empty list");
                return [];
            }

            // There's only one answer
            if (id != undefined) {
                return new Answer(getQueryRow(result));
            }

            // There's multiple answers
            else {
                getQueryRows(result).forEach( (row) => {
                    answers.push(new Answer(row))
                });
                return answers;            
            }
            
        } catch (err) {
            console.error(err)
            return null;
        } 
    }

    async getVotes() {
        var votes = [];
        var result;

        try {
            result = await this.db.query(queries.getAnswerVotes);

            if (!Array.isArray(result.rows) || !result.rows.length) {
                return votes;
            }
            
            getQueryRows(result).forEach( (row) =>
                votes.push(new AnswerVote(row))
            );

            return votes;
        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * Inserts an answer vote into the database, returning true if successful, false if not.
     * @param  {int} id ID of answer
     * @param  {int} vote The vote being inserted
     * @returns  {boolean} result success or failure
     */
    async updateVote(id, vote) {
        try {
            await this.db.query(queries.modifyAnswerVote, [vote, id]);
            return true;
        } catch (err) {
            console.error(err)
            return false;
        }
    }

    /**
     * Inserts an answer into the database, returning a new Answer object if successful, null if not.
     * @param  {int} id ID of answer
     * @param  {int} questionID ID of question being answered
     * @param  {int} userID ID of user posting the answer
     * @param  {string} message the user's answer
     * @param  {string} signature the user's signature
     */
    async insertAnswer(id, questionID, userID, message, upVotes, downVotes, dateCreated, lastModified) {
        try {
            let a = await this.getAnswers({id: id});
            let result;

            if (a.id == undefined) {
                result = await this.db.query(queries.insertAnswer, [id, questionID, userID, message, upVotes, downVotes, dateCreated, lastModified]);
            } else {
                result = await this.db.query(queries.updateAnswer, [message, upVotes, downVotes, lastModified, id]);
            }
            
            let aDetails = {id: id};
            let answer = await this.getAnswers(aDetails);
            return answer;

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    async updateTable(data) {
        if(data == null) return;
        console.log("answer data not null")
        for (const elem of data) {
            await this.insertAnswer(elem['id'], elem['questionID'], elem['userID'], elem['message'], elem['upVotes'], elem['downVotes'], elem['dateCreated'], elem['lastModified']);
        }
    }

}