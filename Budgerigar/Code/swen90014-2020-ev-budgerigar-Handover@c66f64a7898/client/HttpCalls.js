import axios from 'react-native-axios'
import { sign } from './Crypto'
import { SERVER_ROOT } from './CONSTANTS'

const myAxios = axios.create({
    timeout: 8000
});



export function get(path, username) {
    return new Promise(function(resolve, reject) {
        console.log("getting: " + SERVER_ROOT + path);
        makeHeaders(null, username).then(header => {
            myAxios.get(SERVER_ROOT + path, {
                headers: header
            })
            .then(res => {
                console.log("recieved: " + JSON.stringify(res.data));
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        
    }) 
})
}

export function post(path, body, options){

    return new Promise(function(resolve, reject) {
        console.log("Posting to: " + SERVER_ROOT + path);

        console.log(body);
        const { username } = body;
        console.log(username)
        makeHeaders(body, username).then(header => {
            console.log("recieved header:" + header)
            myAxios.post(SERVER_ROOT + path, body, {
                headers: header
            })
            .then(res => {
                console.log("Response data = " + JSON.stringify(res.data));
                console.log("Response status = " + JSON.stringify(res.status));
                resolve(res);
            })
            .catch(error => {
                console.log("[HTTP: POST]: Error" + error);
                reject(error);
        })
    }) 
    })
}

export function del(path, body, options){

    return new Promise(function(resolve, reject) {
        console.log("Sending DELETE to: " + SERVER_ROOT + path);

        console.log(body);
        const { username } = body;
        console.log(username)
        makeHeaders(body, username).then(header => {
            console.log("recieved header:" + header)
            myAxios.delete(SERVER_ROOT + path, {
                headers: header,
                data: body
            })
            .then(res => {
                console.log("Response data = " + JSON.stringify(res.data));
                console.log("Response status = " + JSON.stringify(res.status));
                resolve(res);
            })
            .catch(error => {
                console.log("[HTTP: DELETE]: Error" + error);
                reject(error);
        })
    }) 
    })
}

/* Creates the headers for both GET and POST requests */
export async function makeHeaders(body, username){
    return new Promise(function(resolve, reject){
        const timestamp = Date.now();
        let str =""
        body != null ? str = "v0".concat(":", timestamp, ":", JSON.stringify(body)) :  str = "v0".concat(":", timestamp, ":{}");;
        console.log(str)
        sign(str).then( sig => {
            console.log("THe header sig: " + sig)
            resolve({
                'RightToAsk-Auth': sig,
                'RightToAsk-Timestamp': timestamp,
                'RightToAsk-Username': username,
            })
        })
        .catch(e => reject("Error making headers: " + e))
    })
}