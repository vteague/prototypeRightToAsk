module.exports = class Question {

    // Constructs a question from a returned query row
    constructor(queryRow) {  
        this.id = queryRow.id;
        this.userID = queryRow.user_id;
        this.username = null;
        this.message = queryRow.message;
        this.upVotes = queryRow.up_votes;
        this.downVotes = queryRow.down_votes;
        this.dateCreated = queryRow.date_created;
        this.lastModified = queryRow.last_modified;
    }
}