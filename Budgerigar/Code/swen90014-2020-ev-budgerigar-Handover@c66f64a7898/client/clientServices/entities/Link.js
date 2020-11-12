module.exports = class Link {

    // Constructs a link from a returned query row
    constructor(queryRow) {     
        this.id = queryRow.id;
        this.questionID = queryRow.question_id;
        this.link = queryRow.link;
    }
}