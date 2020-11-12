module.exports = {
    
    validateAnswerID : async function(answerRepo, answerID) {
        console.log(`Validating that answer ID ${answerID} exists`);
        
        var aDetails = {id: answerID};
        var answer = await answerRepo.getAnswers(aDetails);

        if (answer == null) {
            let msg = `Answer with answer ID ${answerID} does not exist`;
            console.log(msg);
            throw new Error(msg);
        }
        return true;
    }
}