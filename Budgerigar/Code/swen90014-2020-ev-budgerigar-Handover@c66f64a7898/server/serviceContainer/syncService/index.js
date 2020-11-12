const express = require('express');
const bodyParser = require('body-parser');

const syncController = require(process.env.COMMON_PATH + 'controllers/syncController');

const app = express();
const PORT = process.env.INCOMING_PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Log request
app.get('*', (req, res, next) => {
    console.log(`Sync service recieved GET request to ${req.url}`);
    next();
});

// Sync all data
app.get('/sync-service/sync', syncController.validateSyncRequest, syncController.getSyncData);

app.listen(PORT, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log(`Express server listening on `+ add + `:${PORT}`)
     })
});