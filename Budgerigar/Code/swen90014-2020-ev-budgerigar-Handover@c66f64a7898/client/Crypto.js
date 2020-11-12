import * as SecureStore from 'expo-secure-store';
var RSAKey = require('react-native-rsa');
import {  JSHash, CONSTANTS } from 'react-native-hash';
var BigInteger = require('react-native-rsa/lib/jsbn');
import { PRIVATE_KEY, USERNAME } from './CONSTANTS'

/* Generates an RSA key of 2048 bits and produces two prime factors "p" and "q" which in turn a private key "d" and a public key "n" is generated. */
export async function generatePair(){
    console.log("Generating Keys")
    const timer = Date.now();
    const bits = 2048;
    const exponent = '10001';
    const rsa = new RSAKey();
    rsa.generate(bits, exponent);
    const timeSpent = (Date.now() - timer) / 1000
    console.log("Keys generated in: " + timeSpent + " seconds")
    const privateKey = JSON.parse(rsa.getPrivateString());
    const keyString = {
        "d": `${privateKey.d}`,
        "n": `${privateKey.n}`
    }
    remember(PRIVATE_KEY, JSON.stringify(keyString))
}

/** Reads and Item from the device's secure storage 
 * @param {string} item the name of the object to be read from secure storage
 */        
export async function read(item){
    try {
        const credentials = await SecureStore.getItemAsync(item);
        return credentials;
    } catch (e) {
        console.log(e);
    }
};

/** Inserts a key value pair into the device's secure storage 
 * @param {string} name the name of the item to be stored in secure storage
 * @param {string} value the value of the item to be stored in secure storage
 */
export async function remember(name, value){
    try {
        console.log(`REMEMBERING ${name}: ${value}`)
        await SecureStore.setItemAsync(name, value);
    } catch (e) {
        console.log(e);
    }
};

/** Deletes a key value pair from the device's secure storage
 * @param {string} name the name of the key inside secure storage
 */
export async function clear(name){
    try {
        await SecureStore.deleteItemAsync(name);
    } catch (e) {
        console.log(e);
    }
};

/* Deletes a user off the device local storage. Not sure what to do with key */
export async function deleteUser(){
    const itemsToBeDeleted = [USERNAME, PRIVATE_KEY ] //, CONSTANTS.MPStatus, CONSTANTS.LastSyncTimeStr]

    itemsToBeDeleted.forEach(item => clear(item))
}

/** signs a given message with the user's private key (HMAC) while hashing with SHA 512 
 * @param message the message to be signed
 * @returns a signature using the users private key in hexcode
*/
export async function sign(message){
    
    return new Promise(function(myMessage) {
        console.log("signing here")
        read(PRIVATE_KEY).then( key => {
            const exponent = JSON.parse(key).d
            const modulo = JSON.parse(key).n
            console.log("private key: " + exponent)
            console.log("public key: " + modulo)
            JSHash(message, CONSTANTS.HashAlgorithms.sha512)
            .then(hash => {
                console.log("hash: " + hash)

                var bi = new BigInteger(hash, 16);
                var exp = new BigInteger(exponent, 16);
                var mod = new BigInteger(modulo, 16);
                var e = new BigInteger("10001", 16);
                const sig = bi.modPow(exp, mod)

                // console.log("Sig Hex: " + sig.toString(16))

                // console.log("+++++++++++++++++++++++++++++")
                // console.log("Verify = " + sig.modPow(e, mod).toString(16))
                // console.log("signature: " + sig.toString(16))

                myMessage(sig.toString(16)); 
            })
            
        })
        .catch(error => console.log("[SIGNING]: " + error))
    }) 
       
};