module.exports = class Tag {

    // Constructs a question from a returned query row
    constructor(queryRow) {  
        this.id = queryRow.id;
        this.tag = queryRow.tag;
        this.dateCreated = queryRow.date_created;
        this.lastModified = queryRow.last_modified;
    }
}