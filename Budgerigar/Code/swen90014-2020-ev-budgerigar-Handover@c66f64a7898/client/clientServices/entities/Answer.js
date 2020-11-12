module.exports = class Answer {

    // Constructs an answer from a returned query row
    constructor(queryRow) {  
        this.id = queryRow.id;
        this.questionID = queryRow.question_id;
        this.userID = queryRow.user_id;
        this.message = queryRow.message;
        this.signature = queryRow.signature;
        this.upVotes = queryRow.up_votes;
        this.downVotes = queryRow.down_votes;
        this.userVote = queryRow.user_vote;
        this.dateCreated = queryRow.date_created;
        this.lastModified = queryRow.last_modified;
    }
}