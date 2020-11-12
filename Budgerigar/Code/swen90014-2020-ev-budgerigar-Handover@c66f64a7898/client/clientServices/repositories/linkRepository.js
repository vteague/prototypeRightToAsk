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
     * @param  {int} questionID (optional) the id to query for
     * @returns { [Link] } a list of Link objects 
     * @returns { [] } the empty list if no matching links exist.
     */
    async getLinks( {id=undefined, questionID=undefined} = {} ) {
        
        var result;
        var links = [];

        try {
            // Find one link
            if (id != undefined) {
                result = await this.db.query(queries.getLink, [id]);
                
                if (getQueryRow(result) != null) {
                    links.push(new Link(getQueryRow(result)));
                }

                else {
                    console.log(`Link with id ${id} does not exist`)
                }
            }

            // Find all links of a question
            else if (questionID != undefined) {
                result = await this.db.query(queries.getLinksFromQuestionID, [questionID]);
                
                if (!Array.isArray(result.rows) || !result.rows.length) {
                    console.log("No results returned from getLinks(questionID), returning empty list")
                }
                else {
                    console.log("Getting all links result: ", result);
                    
                    getQueryRows(result).forEach( (row) => {
                        links.push(new Link(row))
                    });
                }
            }

            else {
                console.error('LinkRepository.getLinks called with incorrect arguments');
                console.error('Please use an object specifying {id: } or {questionID: }.');
                return null;
            }

            return links;

        } catch (err) {
            console.error(err)
            return [];
        }
    }

    /**
     * Inserts a link into the database, returning a new Link object if successful, null if not.
     * @param  {int} id ID of link
     * @param  {int} questionID ID of question link is posted to
     * @param  {int} link the Hansard link to insert
     * @returns {Link} the link object inserted
     * @returns {null} if no link was inserted
     */
    async insertLink(id, questionID, link) {
        try {
            await this.db.query(queries.insertLink, [id, questionID, link]);
            let linkDetails = {id: id}
            let res = await this.getLinks(linkDetails);
            return res[0];

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    async updateTable(data) {
        if(data.length == 0) return;
        console.log("link data not null")
        for (const elem of data) {
            await this.insertLink(elem['id'], elem['questionID'], elem['link']);
        }
    }
}