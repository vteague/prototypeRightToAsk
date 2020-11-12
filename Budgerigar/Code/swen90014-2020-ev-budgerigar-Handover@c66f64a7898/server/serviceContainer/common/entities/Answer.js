module.exports = class Answer {

    // Constructs an answer from a returned query row
    constructor(queryRow) {  
        this.id = queryRow.id;
        this.questionID = queryRow.question_id;
        this.userID = queryRow.user_id;
        this.message = queryRow.message;
        this.upVotes = queryRow.up_votes;
        this.downVotes = queryRow.down_votes;
        this.dateCreated = queryRow.date_created;
        this.lastModified = queryRow.last_modified;
    }
}