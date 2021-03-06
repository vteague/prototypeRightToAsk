module.exports = class TagLink {

    // Constructs a tag link from a returned query row
    constructor(queryRow) {  
        this.tagID = queryRow.tag_id;
        this.questionID = queryRow.question_id;
        this.lastModified = queryRow.last_modified;
        this.dateCreated = queryRow.date_created;
    }
}