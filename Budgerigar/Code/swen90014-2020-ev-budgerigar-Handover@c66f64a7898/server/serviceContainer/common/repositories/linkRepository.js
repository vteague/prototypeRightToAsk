const queries = require('../queries/queries');
const Link = require('../entities/Link.js');
const { getQueryRow, getQueryRows } = require('../utils/parseQuery.js') 


module.exports = class LinkRepository {

    constructor(dbClient) {
        this.db = dbClient;
    }
    
    /**
     * Returns a link object with a given id from the database if it exists, 
     * all links if no id given, or null if no links exist.
     * @param  {int} id (optional) the id to query for
     * @param  {int} questionID (optional) the question id to query for
     * @returns {Link} a link object if id is specified
     * @returns { [Link] } a list of Link objects associated with a question
     * @returns null if no matching links exist.
     */
    async getLinks( {id=undefined, questionID=undefined, fromTime=undefined} = {} ) {
        
        var result;
        var links = [];

        try {
            // Find one link
            if (id != undefined) {
                result = await this.db.query(queries.getLink, [id]);
                return new Link(getQueryRow(result));
            }

            else if (questionID != undefined) {
                result = await this.db.query(queries.getLinksFromQuestionID, [questionID]);
            }

            else if (fromTime != undefined) {
                result = await this.db.query(queries.getLinksFromTime, [fromTime]);
            }

            // Get all links
            else {
                console.log("LinkRepository.getLinks called without any arguments, getting all links")
                result = await this.db.query(queries.getLinks, []);
            }
            
            getQueryRows(result).forEach( (row) => {
                links.push(new Link(row))
            });
            return links;

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * Inserts a link into the database, returning a new Link object if successful, null if not.
     * @param  {int} questionID ID of question being linked
     * @param  {int} link the Hansard link to insert
     * @returns {Link} the link object inserted
     * @returns {null} if no link was inserted
     */
    async insertLink(questionID, link) {
        try {
            let result = await this.db.query(queries.insertLink, [questionID, link]);
            return new Link(getQueryRow(result));

        } catch (err) {
            console.error(err)
            return null;
        }
    }
}