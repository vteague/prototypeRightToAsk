module.exports = {
    
    validateQuestionID : async function(questionRepo, questionID) {
        console.log(`Validating that question ID ${questionID} exists`);
        
        var qDetails = {id: questionID};
        var question = await questionRepo.getQuestions(qDetails);

        if (question == null) {
            let msg = `Question with question ID ${questionID} does not exist`;
            console.log(msg);
            throw new Error(msg);
        }
        return true;
    }
}


