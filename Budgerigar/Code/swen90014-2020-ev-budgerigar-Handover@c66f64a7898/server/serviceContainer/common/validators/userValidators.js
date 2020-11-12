module.exports = {
    
    validateUsernameAvailability : async function(userRepo, username) {
        console.log(`Validating availability of username ${username}`);
        
        var u = {username: username};
        var user = await userRepo.getUsers(u);

        // User exists
        if (user != null) {
            let msg = `User with username ${username} already exists`;
            console.log(msg);
            throw new Error(msg);
        }
        return true;
    },

    validatePublicKeyAvailability : async function(userRepo, publicKey) {
        console.log(`Validating availability of public key '${publicKey.slice(0, 10)}...'`);
        
        var u = {publicKey: publicKey};
        var user = await userRepo.getUsers(u);

        // User exists
        if (user != null) {
            let msg = `User with public key ${publicKey.slice(0, 10)}...' already exists`;
            console.log(msg);
            throw new Error(msg);
        }
        return true;
    },

    validateUserExists : async function(userRepo, username) {
        console.log(`Validating existance of user ${username}`);
        
        var u = {username: username};
        var user = await userRepo.getUsers(u);

        // User doesn't exist
        if (user == null) {
            let msg = `No user with username '${username}' exists`;
            console.log(msg);
            throw new Error(msg);
        }
        return true;
    },

    validateGovEmail : async function(email) {
        console.log(`Validating that ${email} is a valid gov email`);
        console.log(`No email validation logic implemented yet for testing purposes`);

        return true;
    }
}