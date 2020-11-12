import * as Crypto from '../Crypto'
import { register, getQuestions, getSpecificQuestion, postQuestion, getAnswersToQuestion, postAnswer, verifyMP, verifyMPCodem, sendHansardLink } from '../Auth'

const testUser = {
    "username": "TheTestUser",
    "privateKey": {"n": "b44fbb7b783b692d075705e040ecab4ec55b50fac5b54d64a406ae213a55cd6c0c67a6138543c780374d3b77d2518fff50075f098e6afb8404505fab0e7b18dfa3d3792708d3501525c01177ded88a2522f32281341d0c676fabc12d3240e352af13a88910a45e06fd0e5e5c4aed62c714bf76579ae9bf167e8774a7ce48ab58c1d7911de3994e71f967686fca9a3e7609a11fed15f6ed406d3985a216a33c64558051c0b78b1c68de0a66e24fdb9e409d251fda031dcd19fc141e03765ed9fb9dcd63a8332adc847751ca07f8bbb76c1ee4d2316293839225f240d9e5ac5b5ca89cc2d4727ca9afba9751f965d50483ac2bb0807489bcff6f388bfef1b237a1", "d": "40ba168d3e1de5a59a6aecdb11b363d3851940baa4da6e8be02dddb863de853d723e8ae99aff37d099098a7d7aec788aa849dd1deb18106dd5b69c8125539f1c390d23029632751f024c2e791f701037409293225a78cb091e9743635c14db05c57f8312a0fcc01c361f405455395e2a25128e02e8c35c2b51048325f1f13840ab608e2bd95e4e9f36c5ebd0763fba8614d03eac7b82644abfc669a2cd1dc8965a57576c330a8b16db26e90593b2ffd1a42f92ff8fae2a534a0f85815a881358ebf8a0f01705eba885ff077f9a52f82ca2c7453c52571ad5fb913999b004b4d80a251681667e43e2a2bfbe19309351c5b43792c1978d785f1a6e438c80d59321"}
};

/* Crypto Test cases */
// test('KeyPair created successfully and stored in local storage', async () => {
//     /* Test not working as expected due to async */
//     Crypto.generatePair().then( key => expect(key).toBe('2'));
//     const result = await Crypto.read("privateKey");
    
    
// })

// test('sending MP verrification request', async () => {
//     verifyMP("jennstewart", "jenn.stewart@gov.com.au")
// })

// test('sending MP verrification code', async () => {
//     verifyMPCode("jennstewart", "123456")
// })

test('sending hansard link', async () => {
    sendHansardLink("1", "https://www.testlink.com")
})

// test('Registering new user', () => {
//     const username = "newTestUser";
//     Crypto.generatePair().then( () => 
//         register(username).then(expect(1).toBe(1))
//     )
// })



// test('Getting all questions from server', async () => {
//     getQuestions(null).then( res => {
//         console.log(res)
//         expect(res).toBe(true)
//     })
// })

// test('Getting a specific question from server', async () => {
//     getSpecificQuestion(1).then( res => {
//         console.log(res)
//         expect(res).toBe(true)
//     })
// })

// test('Posting a question to server', async () => {
//     const username = "jennstewart";
//     const message = "What are we doing to prevent XYZ from...?"
//     console.log("posting username and q")
//     postQuestion(username, message).then( res => {
//         console.log(res)
//         expect(res).toBe(true)
//     })
// })

// test('Getting a all answers to a specific question from server', async () => {
//     getAnswersToQuestion(1).then( res => {
//         console.log(res)
//         expect(res).toBe(true)
//     })
// })

// test('Posting an answer to a question to server', async () => {
//     const username = "jennstewart";
//     const message = "This issue has been raised in the past however..."
//     const qID = 1
//     console.log("posting username and q")
//     postAnswer(username, message, qID).then( res => {
//         console.log(res)
        
//     }).then(expect(true).toBe(true))
// })

// test("making auth header", async() => {
//     Crypto.generatePair().then(
//         makeHeader("hello")
//     )
    
// })