
module.exports = {
    /**
     * @param  {Result} queryResult result of a query with one row
     * @returns {Row} a query row with format similar to { id: ... }
     */
    getQueryRow : function(queryResult) {
        // Ensure query result actually has a result
        if (queryResult.rowCount == 1) {
            return queryResult.rows[0];
        }

        // Too many 
        else if (queryResult.rowCount > 1) {
            console.log("Too many results, just returning first");
            let row = queryResult.rows[0];
            return row;
        }

        // No query result
        else {
            console.log("No query results, returning null")
            return null;
        }
    },
    /**
     * @param  {Result} queryResult result of a query with multiple rows
     * @returns { [Row] } a list of query rows with format similar to [ { id: ... }, ... ]
     */
    getQueryRows: function(queryResult) {
        if (queryResult.rows != undefined) {
            return queryResult.rows;
        }
        else {
            return [];
        }
    }
}
