module.exports = class AnswerVote {

    // Constructs a question vote from a returned query row
    constructor(queryRow) {  
        this.aID = queryRow.id;
        this.vote = queryRow.user_vote;
    }
}