module.exports = class DetailedQuestion {

    // Constructs a comprehensive question from an existing question
    constructor(question) {  
        this.id = question.id;
        this.userID = question.userID;
        this.username = null;
        this.message = question.message;
        this.upVotes = question.upVotes;
        this.downVotes = question.downVotes;
        this.dateCreated = question.dateCreated;
        this.lastModified = question.lastModified;
        this.answers = null;
        this.links = null;
        this.tags = null;
        this.reports = null;
    }
}