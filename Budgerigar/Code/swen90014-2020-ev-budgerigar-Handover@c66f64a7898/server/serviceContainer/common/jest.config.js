// Use local .env for testing
require('dotenv').config({ path: './.env.local' });
process.env.NODE_ENV = 'test';

module.exports = async () => {
    return {
        verbose: true,
        rootDir: "./",
        setupFilesAfterEnv: ["<rootDir>/jest/testSetup.js"]
    }
};