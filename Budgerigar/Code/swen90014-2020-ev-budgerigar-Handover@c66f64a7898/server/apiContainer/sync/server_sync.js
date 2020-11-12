const express = require('express');
const https = require('https');
const http = require('http');

const fs = require('fs');
const app = express();
const PORT = 8082;

const endpoint ='/api/sync'

var privateKey = fs.readFileSync('privkey.pem')
var certificate = fs.readFileSync('fullchain.pem')

var serverConfig = {
	key : privateKey,
	cert : certificate
};

const options = {
    hostname: 'nginx_service',
    port: 80,
    method: 'GET',
}

// Sync data
app.get(endpoint,(apiReq, apiRsp) => {
    console.log('Sync RestAPI hit, forwarding to verify service..')
    console.log(apiReq.query.last_sync)
    if (typeof apiReq.get('RightToAsk-Auth') !== 'undefined') {
      options.headers = {
        'RightToAsk-Timestamp': apiReq.get('RightToAsk-Timestamp'),
        'RightToAsk-Auth': apiReq.get('RightToAsk-Auth'),
        'RightToAsk-Username': apiReq.get('RightToAsk-Username')
      }
    }

//    options.path = '/auth/sync-service/questions/' + apiReq.params.qID
    options.path = '/auth/sync-service/sync?last_sync=' + apiReq.query.last_sync
    const req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      var rspStr = ''
      res.on('data', (chunk) => {
        rspStr = rspStr + chunk
      });
      res.on('end', () => {
        apiRsp.statusCode = res.statusCode;
        apiRsp.json(JSON.parse(rspStr));
      });
    });
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    req.end();  
})
https.createServer(serverConfig,app).listen(PORT, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	console.log('');
        console.log(`SYNC micro-service listening on `+ add + `:${PORT}`)
     })
})
