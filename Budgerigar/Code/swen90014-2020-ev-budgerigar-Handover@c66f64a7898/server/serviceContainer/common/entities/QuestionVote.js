module.exports = class QuestionVote {

    // Constructs a vote from a returned query row
    constructor(queryRow) {     
        this.userID = queryRow.user_id;
        this.questionID = queryRow.question_id;
        this.vote = queryRow.vote;
    }
}