const queries = require('../queries/queries');
const Tag = require('../entities/Tag.js');
const TagLink = require('../entities/TagLink.js')
const { getQueryRow, getQueryRows } = require('../utils/parseQuery.js') 


module.exports = class TagRepository {

    constructor(dbClient) {
        this.db = dbClient;
    }
    
    /**
     * Returns an array of tags from the database matching the provided arguments. 
     * @param  { {id} } int (optional) the id to query for
     * @param  { {tag} } string (optional) the id to query for
     * @param  { {questionID} } int (optional) the id to query for

     * @returns { [Tag] } a list of all matching tags,
     * or all tags if no argument given.
     * @returns { [] } if no matches found
     */
    async getTags( {id=undefined, tag=undefined, questionID=undefined} = {}) {
        
        var tags = [];
        var result;

        try {
            if (id != undefined) {
                result = await this.db.query(queries.getTagFromID, [id]);
            }
            
            else if (tag != undefined) {
                result = await this.db.query(queries.getTagFromTag, [tag]);
            }

            else if (questionID != undefined) {
                result = await this.db.query(queries.getTagsFromQuestionID, [questionID]);
            }
            
            // Get all tags
            else {
                result = await this.db.query(queries.getTags);
            }
        
            if (!Array.isArray(result.rows) || !result.rows.length) {
                console.log(`No results returned from getTags(id:${id}, tag:${tag}, questionID:${questionID})`); 
                console.log(`Returning empty list`)
            }
            else {
                getQueryRows(result).forEach( (row) => tags.push(new Tag(row) ));
            }

            return tags;

        } catch (err) {
            console.error(err)
            return [];
        }
    }

    /**
     * Returns a tag object, or multiple tags if questionID specified, from the database if they exist, null if not. 
     * @returns { [TagJSON] } a list of all matching tags,
     * or all tags if no argument given.
     * @returns { [] } if no matches found
     */
    async getFormattedTags() {
        
        var tags = [];
        var result;

        try {         
            // Get all tags
            result = await this.db.query(queries.getAllFormattedTags);
        
            if (!Array.isArray(result.rows) || !result.rows.length) {
                console.log(`No results returned`); 
                console.log(`Returning empty list`);
                return [];
            }
            else {
                getQueryRows(result).forEach( (row) => tags.push(
                                {   name: row.name, 
                                    tagId: row.tagid,
                                    count: row.count } ));
            }

            return tags;

        } catch (err) {
            console.error(err)
            return [];
        }
    }

    /**
     * Inserts a tag into the database, returning a new Tag object if successful.
     * @param  {string} id the tag to add
     * @param  {string} tag the tag to add
     * @returns {Tag} newly created tag object
     * @returns {null} null if insert was unsuccessful
     */
    async insertTag(id, tag) {
        try {
            await this.db.query(queries.insertTag, [id, tag]);

            let tDetails = {id: id};
            let res = await this.getTags(tDetails);
            return res[0];
            
        } catch (err) {
            console.error(err)
            return null;
        }
    }

    async updateTable(data) {
        if(data.length == 0) return;
        console.log("tag data not null")
        data.forEach(elem => {
            this.insertTag(elem['id'], elem['tag']);
        })
    }


    /**
     * Links a tag to a question through the many-to-many relationship table 'tag'
     * @param  {int} tagID the id of the tag
     * @param  {int} questionID the id of the question
     * @returns {TagLink} if link created
     * @returns {null} if no link was created
     */
    async linkTagToQuestion(tagID, questionID) {

        try {
            
            await this.db.query(queries.linkTagToQuestion, [tagID, questionID]);
            var res = await this.db.query(queries.getTagLink, [tagID, questionID]);
            return new TagLink(getQueryRow(res))
                
        } catch (err) {
            console.error(err)
            return null;
        }
    }

    async updateTableLinks(data) {
        for (const elem of data) {
            await this.linkTagToQuestion(elem['tagID'], elem['questionID']);     
        }
    }
}