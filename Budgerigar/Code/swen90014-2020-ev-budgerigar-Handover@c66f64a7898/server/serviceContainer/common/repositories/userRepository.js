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
     * @param  {int} id (optional) the id to query for
     * @param  {string} username (optional) the username to query for
     * @param  {string} publicKey (optional) the publicKey to query for
     */    
    async getUsers( {id=undefined, username=undefined, publicKey=undefined, fromTime=undefined, forClient=false} = {} ) {

        var result = null;
        var users = [];

        try {
            
            if (id != undefined) {
                result = await this.db.query(queries.getUserFromID, [id]);
            }

            else if (publicKey != undefined) {
                result = await this.db.query(queries.getUserFromPublicKey, [publicKey]);
            }

            else if (username != undefined) {
                // make sure user isn't <deleted>
                if (username == "<deleted>") {
                    console.log("Trying to get user with username <deleted>, returning null instead");
                    return null;
                }
                result = await this.db.query(queries.getUserFromName, [username]);
            }

            else if (fromTime != undefined) {
                result = await this.db.query(queries.getUsersFromTime, [fromTime]);
            }
            
            // No arguments provided
            else {
                console.log('UserRepository.getUser called without any arguments, getting all users');
                result = await this.db.query(queries.getUsers);
            }

            // Check for results
            if (result.rows === undefined || result.rows.length == 0) {
                // No results
                console.log("getUsers() returned no results, returning null");
                return null;
            }

            // Searching for only one User
            if (id != undefined || username != undefined || publicKey != undefined) {
                return new User(getQueryRow(result));
            }

            // Searching for multiple users
            getQueryRows(result).forEach( (row) => {
                var user = new User(row);
                
                // Remove sensitive data
                if (forClient) {
                    delete user.email;
                    delete user.verificationCode;
                }

                users.push(user)
            });

            return users;

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * Inserts a user into the database, returning a new User object if successful, null if not.
     * @param  {string} username the username to insert
     * @param  {string} publicKey the public ky to insert
     */
    async insertUser(username, publicKey) {
        
        try {
            let result = await this.db.query(queries.insertUser, [username, publicKey]);
            return new User(getQueryRow(result));

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    /**
     * @returns {User} User object if update successfully made
     * @returns {null} null if no id specified, or there was an error updating the users
     */
    async updateUser( {id=undefined, username=undefined, email=undefined, publicKey=undefined, 
        verificationCode=undefined, isMP=undefined, forClient=false} = {} ) {
        
        var res;
        
        if (id == undefined) {
            console.log("No user id specified to update");
            return null;
        }

        try {
            if (email != undefined) {
                res = await this.db.query(queries.updateUserEmail, [id, email]);
            }

            if (username != undefined) {
                res = await this.db.query(queries.updateUserUsername, [id, username]);
            }

            if (publicKey != undefined) {
                res = await this.db.query(queries.updateUserPublicKey, [id, publicKey]);
            }

            if (verificationCode != undefined) {
                res = await this.db.query(queries.updateUserCode, [id, verificationCode]);
            }

            if (isMP == true || isMP == false) {
                res = await this.db.query(queries.updateUserMP, [id, isMP]);
            }

            if (res != undefined && res.rows.length > 0) {
                let user = new User(getQueryRow(res));
                // Remove sensitive information
                if (forClient) {
                    delete(user.email);
                    delete(user.verificationCode);
                }
                return user;
            }

            // No update made, return null
            return null;
       
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}