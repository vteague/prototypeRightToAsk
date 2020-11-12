module.exports = class User {

    // Constructs a question from a returned query row
    constructor(queryRow) {
        this.id = queryRow.id;
        this.username = queryRow.username;
        this.publicKey = queryRow.public_key;
        this.isMP = queryRow.is_mp;
        this.dateCreated = queryRow.date_created;
        this.lastModified = queryRow.last_modified;
    }
}