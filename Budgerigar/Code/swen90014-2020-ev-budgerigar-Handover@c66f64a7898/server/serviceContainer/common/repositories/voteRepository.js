const queries = require('../queries/queries');
const QuestionVote = require('../entities/QuestionVote.js');
const AnswerVote = require('../entities/AnswerVote.js');
const { getQueryRow, getQueryRows } = require('../utils/parseQuery.js') 


module.exports = class VoteRepository {

    constructor(dbClient) {
        this.db = dbClient;
    }
    
    /**
     * Returns a vote object with a given id from the database if it exists, 
     * all links if no id given, or null if no links exist.
     * @param  {int} userID (optional) the id to query for
     * @returns { [QuestionVote] } a list of Vote objects associated with a user
     * @returns null if no matching votes exist.
     */
    async getQuestionVotes( {userID=undefined} = {} ) {
        
        var result;
        var votes = [];

        try {
            // Find all question votes of a given user
            if (userID != undefined) {
                result = await this.db.query(queries.getUserQuestionVotes, [userID]);

                getQueryRows(result).forEach( (row) => {
                    votes.push(new QuestionVote(row));
                });

                return votes;
            }

            else {
                console.error('VoteRepository.getQuestionVotes called with incorrect arguments');
                console.error('Please use an object specifying {userID: }.');
                return null;
            }

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * Returns a vote object with a given id from the database if it exists, 
     * all links if no id given, or null if no links exist.
     * @param  {int} userID (optional) the id to query for
     * @returns { [AnswerVote] } a list of Vote objects associated with a user
     * @returns null if no matching votes exist.
     */
    async getAnswerVotes( {userID=undefined} = {} ) {
        
        var result;
        var votes = [];

        try {
            // Find all answer votes of a given user
            if (userID != undefined) {
                result = await this.db.query(queries.getUserAnswerVotes, [userID]);

                getQueryRows(result).forEach( (row) => {
                    votes.push(new AnswerVote(row));
                });

                return votes;
            }

            else {
                console.error('VoteRepository.getAnswerVotes called with incorrect arguments');
                console.error('Please use an object specifying {userID: }.');
                return null;
            }

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * Updates a question vote in the database
     */
    async changeQuestionVote({qID, upDelta, downDelta}, userID) {
        try {
            var vote = 0;
            if (upDelta == 1)   {vote = 1;}
            if (downDelta == 1) {vote = -1;}
            
            await this.db.query(queries.modifyQuestionVote, [userID, qID, vote]);
            
            if (upDelta != 0 || downDelta != 0) {
                await this.db.query(queries.updateQuestionVoteTallies, [qID, upDelta, downDelta]);
            }
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * Updates a answer vote in the database
     */
    async changeAnswerVote({aID, upDelta, downDelta}, userID) {
        try {
            var vote = 0;
            if (upDelta == 1)   {vote = 1;}
            if (downDelta == 1) {vote = -1;}
            
            await this.db.query(queries.modifyAnswerVote, [userID, aID, vote]);
            
            if (upDelta != 0 || downDelta != 0) {
                await this.db.query(queries.updateAnswerVoteTallies, [aID, upDelta, downDelta]);
            }
        } catch (err) {
            console.error(err)
        }
    }
}
