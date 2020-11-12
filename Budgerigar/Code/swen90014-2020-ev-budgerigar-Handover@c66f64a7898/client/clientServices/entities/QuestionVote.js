module.exports = class QuestionVote {

    // Constructs a question vote from a returned query row
    constructor(queryRow) {  
        this.qID = queryRow.id;
        this.vote = queryRow.user_vote;
    }
}