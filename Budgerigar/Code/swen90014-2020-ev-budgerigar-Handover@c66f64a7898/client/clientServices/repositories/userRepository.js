const queries = require('../queries/queries');
const User = require("../entities/User.js");
const { getQueryRow, getQueryRows } = require('../utils/parseQuery.js') 

module.exports = class UserRepository {

    constructor(dbClient) {
        // The DB connection to use
        this.db = dbClient;
    }
     
    /**
     * Returns a user object from the database if a parameter is specified, all users if not, 
     * or null if no user exists.
     * @param  {int} id (optional) the user id to query for
     * @param  {string} username (optional) the username to query for
     * @param  {string} publicKey (optional) the publicKey to query for
     */    
    async getUsers( {id=undefined, username=undefined, publicKey=undefined} = {} ) {

        var result = null;
        var user = null;
        var users = [];

        try {
            if (id == undefined && username == undefined && publicKey == undefined) {
                console.log('UserRepository.getUser called without any arguments, getting all users');
                result = await this.db.query(queries.getUsers);
            }
            
            else if (id != undefined) {
                result = await this.db.query(queries.getUserFromID, [id]);
            }

            else if (username != undefined) {
                result = await this.db.query(queries.getUserFromName, [username]);
            }
            
            // Public key is defined
            else {
                result = await this.db.query(queries.getUserFromPublicKey, [publicKey]);
            }
            
            // No users exist with given parameters
            if (result == null || result.rows.length == 0) {
                return null;
            }
            
            // One user returned
            if (result.rows.length == 1) {   
                user = new User(getQueryRow(result));
                return user;
            }
            
            // Multiple users have been returned
            else {
                for (var row in getQueryRows(result)) {
                    users.push(new User(row));
                }
                return users;
            }

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * Inserts a user into the database, returning a new User object if successful, null if not.
     * @param  {int} id the user id to insert
     * @param  {string} username the username to insert
     * @param  {string} publicKey the public ky to insert
     */
    async insertUser(id, username, publicKey, isMP, dateCreated, lastModified) {
        console.log(`recived ${id}, ${username}, ${publicKey}`)
        try {
            let exists_query = `SELECT EXISTS(SELECT 1 FROM users WHERE id=?);`
            let exists = await this.db.query(exists_query, [id]);
            let result;
            if (getQueryRow(exists)[exists_query]) {
                result = await this.db.query(queries.updateUsername, [username, id]);
            } else {
                result = await this.db.query(queries.insertUser, [id, username, publicKey, isMP, dateCreated, lastModified]);
            }

            console.log("Insert user result: ", result);
            
            let userDetails = {id:id};
            return this.getUsers(userDetails);

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    async updateTable(data) {
        if(data == null) return;
        console.log("update data not null")
        for (const elem of data) {
            await this.insertUser(elem['id'], elem['username'], elem['publicKey'], elem['isMP'], elem['dateCreated'], elem['lastModified']);
        }
    }

    /**
     * Updates a user row in the database. Takes an object with defined parameters, 
     * eg: {id: 5, username: "Example McGee"}
     * @returns {User} if update successfully made
     * @returns {null} if no id specified, or there was an error updating the user
     */
    async updateUser( {id=undefined, username=undefined, isMP=undefined} = {} ) {
        
        var res;
        
        if (id == undefined) {
            console.log("No user id specified to update");
            return null;
        }

        try {
            if (username != undefined) {
                res = await this.db.query(queries.updateUsername, [username, id]);
            }

            if (isMP == true || isMP == false) {
                res = await this.db.query(queries.updateUserMP, [isMP, id]);
            }

            if (res != undefined) {
                var userDetails = {id: id};
                return await this.getUsers(userDetails);
            }

            // No update made, return null
            return null;
       
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}