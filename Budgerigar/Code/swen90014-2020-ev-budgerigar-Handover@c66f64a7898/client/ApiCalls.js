import { get, post, del } from './HttpCalls'
import { deleteUser, read, remember} from './Crypto'

import { userRepo, linkRepo, answerRepo} from './clientServices/repositories/LogicRepositories';

import { clientSyncUpdate, handleQuestionPostResponse } from './clientServices/clientDataHandler';
import { LAST_SYNC, PRIVATE_KEY, USERNAME, DEFAULT_TIME } from './CONSTANTS'
const db = require('./clientServices/dbConnection');
// API endpoints
const USERS = 'api/users'
const VERIFY = 'api/users/verify'
const QUESTIONS = 'api/questions'
const SYNC = 'api/sync'

import { buildReduxData } from './clientServices/builders/reduxDataBuilders';

/** Send a post request containing username and public key to server.
 * If no username found in db a new user is created. Otherwise the request is
 * rejected with an username used error (403) 
 * @param {string}  myUsername the username of the user logged into the app
 */
export function register(myUsername){
    return new Promise(function(resolve, reject){
        db.initDB()
        // Send POST to server and wait for response
        read(PRIVATE_KEY).then( key => {
            post(USERS, {"username": myUsername, "publicKey": JSON.parse(key).n}, null)
            .then(res => {
                console.log(res.data.details)
                console.log("User signed up: key distributed");
                
                // unpack response and insert into SQLite
                const {id, username, publicKey, isMP, dateCreated, lastModified} = res.data.details;
                userRepo.insertUser(id, username, publicKey, isMP, dateCreated, lastModified);
                // remember user name the data 1/1/1970 as a default for sync
                remember(USERNAME, username);
                remember(LAST_SYNC, DEFAULT_TIME);
                resolve(res)
            
                
            }).catch( rejection => {
                if (rejection.response){
                    console.log(rejection.response.data)
                }
                console.log(JSON.stringify(rejection))
                reject(rejection)
            })
        })
    })
}

/** Get the latest data update from Server 
 * @param {string} username the username of the logged in user
 * @param {string} timeframe the last time stamp synced with server. May be removed and gotten from local storage
 */
export function syncDB(username){
    return new Promise(function(resolve, reject){
        read(LAST_SYNC)
        .then(timeframe => {
            console.log(`GETTING ALL QUESTIONS FROM ${timeframe} ONWARDS`);
            const path = `?last_sync=${timeframe}`;
            get(SYNC + path, username)
            .then(res => {   
                clientSyncUpdate(res.data).then( cres => {
                    console.log("LAST SYNC TIME FROM SERVER = " + res.data['sync_time'])
                    remember(LAST_SYNC, res.data['sync_time']).then(resolve(res))
                    
                })

            })
        })
        
        .catch( rejection => {
            console.log("error " + rejection)
            reject(rejection)
        })
    })
}

/** Post question to DB then take the return response and send it be inserted 
 * into SQLite
 * @param {string} username the username of the logged in user
 * @param message the question data to be sent
 * @param tags the tags of the question
 */
export function postQuestion(username, message, tags){
    return new Promise(function(resolve, reject){
        console.log(`Posting question = ${message} authored by ${username}`);
        let info = buildReduxData(); console.log(info);
        // Set up body of message as a tag field is required if there are tags.
        let body = "";
        tags != null ? 
            body = {"username": username, "message": message, "tags": tags.map(tag => tag.name)} : 
            body = {"username": username, "message": message};

        // Post the question to the server
        post(QUESTIONS, body)
        .then( res => {
            handleQuestionPostResponse(res.data.details);
            resolve(res);
        })
        .catch( rejection => {
            console.log("error " + rejection);
            reject(rejection);
        })
    })
}

/** Post and answer to server then insert the response into SQLlite 
 * @param {string} username the username of the logged in user
 * @param message the answer data to be sent
 * @param questionID the of the question being answered
 */
export function postAnswer(username, message, questionID){
    return new Promise(function(resolve, reject){
        console.log(`Posting answer = ${message} authored by ${username} for question ID = ${questionID}`);

        // Create correct api pathway
        const path = `/${questionID}/answers`

        // Post the question
        post(QUESTIONS + path, {"username": username, "message": message})
        .then( res => {
            
            // insert the question into the SQLite
            const {id, questionID, userID, message, upVotes, downVotes, dateCreated, lastModified} = res.data.details
            answerRepo.insertAnswer(id, questionID, userID, message, upVotes, downVotes, dateCreated, lastModified)
            resolve(res);

        }).catch( rejection => {
            console.log("error " + rejection)
            reject(rejection)
        })
    })
}


/** Deliver MP email to server so that they can be later verified 
 * @param {string} username the username of the logged in user
 * @param {string} email the MP email to be sent a verification code
 */
export function verifyMP(username, email){
    return new Promise(function(resolve, reject){
        console.log("Sending MP registration request")
        // send request to server
        post(VERIFY, {"username": username, "email": email})
        .then(res => {
            // TODO set MP status to pending
            resolve(res)
        })
        .catch(rejection => reject(rejection))
    })
}

/** Deliver user inputed verification code to server so that it can be verified
 * @param {string} username the username of the logged in user
 * @param code the verification code to then be verified with server
 */
export function verifyMPCode(userName, code){
    return new Promise(function(resolve, reject){
        console.log("Sending MP verification request code")
        // Post code to the server
        post(VERIFY + `/${code}`, {"username": userName})
        .then(res => {
            // set users status to mp in secure storage
            userRepo.getUsers({username: userName})
            .then(user => {
                console.log("User ID is " + user.id)
                userRepo.updateUser({id: user.id, isMP: true})
            })
            resolve(res)
        })
        .catch(rejection => reject(rejection))
    })
}

/** Send Hansard Link that was used to answer question and store into sqlite
 * @param questionID the id of the question
 * @param link the hansard link inputed
 * @param {string} username the username of the logged in user
 */
export function sendHansardLink(questionID, link, username){
    return new Promise(function(resolve, reject){
        console.log(`Sending Hansard link to question ${questionID}`)
        // Post link to server
        post(QUESTIONS + `/${questionID}/links`, {"link": link, "username": username})
        .then(res => {
            //store link in sqlite
            const {id, questionID, link} = res.data.details
            linkRepo.insertLink(id, questionID, link)
            resolve(res)
        })
        .catch(rejection => reject(rejection))
    })
}

/** Send request to delete user from db then delete user and sqlite from device
 * @param {string} username the username of the logged in user
*/
export function deleteUserRequest(userName){
    return new Promise(function(resolve, reject){
        
        console.log(`Attempting to delete User: ${userName}`)
        // Grab user id
        userRepo.getUsers({username: userName}).then(user => {
            console.log("MY USer: " + user.id)
            const path = `/${user.id}`
            // send delete request to server
            del(USERS + path, {"username": userName})
            .then(res => {
                // delete user from local storage
                deleteUser();
                // delete SQLite DB
                db.deleteDB();
                console.log("USER SUCCESSFULLY")
                resolve(res);
            })
        })
        .catch(rejection => reject(rejection))
    })
}

/** Send Votes to server 
 * @param {string} userName the username of the logged in user
 * @param questionVotes the array of the user's questions on answers
 * @param answerVotes the array of the user's votes on answers
 */
export function sendVotes(userName, questionVotes, answerVotes){
    return new Promise(function(resolve, reject){
        // Get user ID
        userRepo.getUsers({username: userName}).then(user => {
            const userID = user.id
            console.log(`Attempting to send votes: ${userName} (${userID}): ${JSON.stringify(questionVotes)} and ${answerVotes}`)
            // Create correct api path/endpoint
            const path = `/${userID}/votes`;

            q_votes = []
            Object.keys(questionVotes).forEach(function(key) {
                var value = questionVotes[key];
                console.log(key)
                console.log(value)
                q_votes.push({"qID": parseInt(key), "vote": value})
            });

            a_votes = []
            Object.keys(answerVotes).forEach(function(key) {
                var value = answerVotes[key];
                console.log(key)
                console.log(value)
                a_votes.push({"aID": parseInt(key), "vote": value})
            });

            console.log(q_votes)
            // Send votes
            post(USERS + path, {"username": userName, "questionVotes": q_votes, "answerVotes": a_votes})
            .then(res => {
                console.log(res)
                // TODO deal with res
                resolve(res);
            })
            
        }).catch(rejection => reject(rejection))
    })
}