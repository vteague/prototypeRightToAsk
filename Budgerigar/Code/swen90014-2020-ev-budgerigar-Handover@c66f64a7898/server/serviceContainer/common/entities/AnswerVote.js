module.exports = class AnswerVote {

    // Constructs a vote from a returned query row
    constructor(queryRow) {     
        this.userID = queryRow.user_id;
        this.answerID = queryRow.answer_id;
        this.vote = queryRow.vote;
    }
}