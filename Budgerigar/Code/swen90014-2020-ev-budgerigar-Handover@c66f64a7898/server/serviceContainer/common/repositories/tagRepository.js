const queries = require('../queries/queries');
const Tag = require('../entities/Tag.js');
const TagLink = require('../entities/TagLink.js')
const { getQueryRow, getQueryRows } = require('../utils/parseQuery.js') 


module.exports = class TagRepository {

    constructor(dbClient) {
        this.db = dbClient;
    }
    
    /**
     * Returns a tag object, or multiple tags if questionID specified, from the database if they exist, null if not. 
     * @param  { {id} } id (optional) the id to query for
     * @param  { {tag} } tag (optional) the tag string to query for
     * @param  { {questionID} } questionID (optional) the id to query for

     * @returns { Tag } a tag matching the id or tag parameters provided
     * @returns { [Tag] } a list of all tags for a question if questionID parameter is provided,
     * or all tags if no argument given.
     * @returns null if no matches found
     */
    async getTags( {id=undefined, tag=undefined, questionID=undefined, fromTime=undefined} = {}) {
        
        var tags = [];
        var result;

        try {
            if (id != undefined) {
                result = await this.db.query(queries.getTagFromID, [id]);
                return new Tag(getQueryRow(result));
            }
            
            else if (tag != undefined) {
                result = await this.db.query(queries.getTagFromTag, [tag]);
                return new Tag(getQueryRow(result));
            }

            else if (questionID != undefined) {
                result = await this.db.query(queries.getTagsFromQuestionID, [questionID]);
            }

            else if (fromTime != undefined) {
                result = await this.db.query(queries.getTagsFromTime, [fromTime]);
            }
            
            // Get all tags
            else {
                result = await this.db.query(queries.getQuestions);
            }
        
            // List of tags returned
            getQueryRows(result).forEach( (row) => tags.push(new Tag(row) ));
            return tags;

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * Returns a list of tagLink objects from the database. 
     * @param  fromTime datetime in format YYYY-MM-DDThh:mm (UTC time)
     * @returns { [Tag] }  a list of all tags for a question if questionID parameter is provided,
     * or all tags if no argument given.
     * @returns null if no matches found
     */
    async getTagLinks( {fromTime=undefined} = {}) {
        
        var tagLinks = [];
        var result;

        try {
            if (fromTime != undefined) {
                result = await this.db.query(queries.getTagLinksFromTime, [fromTime]);
            }            

            // Get all tag links
            else {
                result = await this.db.query(queries.getTagLinks, []);
            }
        
            getQueryRows(result).forEach( (row) => tagLinks.push(new TagLink(row)));
            return tagLinks;

        } catch (err) {
            console.error(err)
            return null;
        }
    }



    /**
     * Inserts a tag into the database, returning a new Tag object if successful.
     * @param  {string} tag the tag to add
     * @returns {Tag} newly created tag object
     * @returns {null} null if insert was unsuccessful
     */
    async insertTag(tag) {
        try {
            let result = await this.db.query(queries.insertTag, [tag]);

            return new Tag(getQueryRow(result));
            
        } catch (err) {
            console.error(err)
            return null;
        }
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
            // Get new tag ID
            let result = await this.db.query(queries.linkTagToQuestion, [tagID, questionID]);

            return new TagLink(getQueryRow(result));
                
        } catch (err) {
            console.error(err)
            return null;
        }
    }
}