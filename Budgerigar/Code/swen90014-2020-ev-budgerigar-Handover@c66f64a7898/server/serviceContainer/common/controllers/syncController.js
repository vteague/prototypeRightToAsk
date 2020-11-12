const { query, validationResult}        = require('express-validator');
const db                                = require('../dbConnection');
const SyncBuilder                       = require('../builders/syncBuilder');

// Set of validation functions to use before passing to business logic
var validateSyncRequest = [
    query('last_sync').optional().isISO8601().withMessage('datetime must be of format YYYY-MM-DDTHH:MM:SSZ (UTC time)'),    
];

var getSyncData = async function(req, res, next) {
    // Send 400 bad request if failed validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Request failed validation');
        return res.status(400).json({ errors: errors.array() })
    }

    console.log('Sync controller recieved a request to sync');
        
    (async function() {

        var lastSync = req.query.last_sync;

        console.log(`Collecting sync data from date ${lastSync}`);

        var syncBuilder = new SyncBuilder(db);
        var syncResponse = await syncBuilder.buildSyncResponse(lastSync)
        syncResponse.sync_time = new Date().toISOString();

        return res.status(200).json(syncResponse);
    })();
};

module.exports = {
    getSyncData,
    validateSyncRequest
};
