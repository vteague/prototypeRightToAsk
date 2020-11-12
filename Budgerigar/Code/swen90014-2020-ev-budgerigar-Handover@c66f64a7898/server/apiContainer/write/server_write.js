const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8081;
const endpoint1 = '/api/questions'
const endpoint2 = '/api/questions/:qID/answers'
const endpoint3 = '/api/questions/:qID/links'


var privateKey = fs.readFileSync('privkey.pem')
var certificate = fs.readFileSync('fullchain.pem')

var serverConfig = {
	key : privateKey,
	cert : certificate
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const postQuestions = {
  hostname: 'nginx_service',
  port: 80,
  path: '/auth/write-service/questions',
  method: 'POST',
}
const postNginxService = {
  hostname: 'nginx_service',
  port: 80,
  method: 'POST',
}

app.post(endpoint1,(apiReq, apiRsp) => {
    console.log('Write RestAPI hit, forwarding to verify service..')
    var reqJson= JSON.stringify(apiReq.body)

    postQuestions.headers = {
      'Content-Type': 'application/json',
      'Content-Length': reqJson.length
    }
    if (typeof apiReq.get('RightToAsk-Auth') !== 'undefined') {
      postQuestions.headers = {
        'RightToAsk-Timestamp': apiReq.get('RightToAsk-Timestamp'),
        'RightToAsk-Auth': apiReq.get('RightToAsk-Auth'),
        'RightToAsk-Username': apiReq.get('RightToAsk-Username'),
        'Content-Type': 'application/json',
        'Content-Length': reqJson.length
      }
    }

    const req = http.request(postQuestions, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      var rspStr = ''
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
        rspStr = rspStr + chunk;
      });
      res.on('end', () => {
        console.log('No more data in response.');
        apiRsp.statusCode = res.statusCode;
        apiRsp.json(JSON.parse(rspStr));
      });
    });
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    
    // Write data to request body
    req.write(reqJson);
    req.end();
  
})


app.post(endpoint2,(apiReq, apiRsp) => {
  console.log('Write api/questions/:qID/answers hit, forwarding to verify service..')
  var reqJson= JSON.stringify(apiReq.body)
  postNginxService.headers = {
    'Content-Type': 'application/json',
    'Content-Length': reqJson.length
  }
  if (typeof apiReq.get('RightToAsk-Auth') !== 'undefined') {
    postNginxService.headers = {
      'RightToAsk-Timestamp': apiReq.get('RightToAsk-Timestamp'),
      'RightToAsk-Auth': apiReq.get('RightToAsk-Auth'),
      'RightToAsk-Username': apiReq.get('RightToAsk-Username'),
      'Content-Type': 'application/json',
      'Content-Length': reqJson.length
    }
  }

  postNginxService.path = '/auth/write-service/questions/' + apiReq.params.qID + '/answers';
  console.log('path is ' + postNginxService.path)
  const req = http.request(postNginxService, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    
    var rspStr = ''
    res.on('data', (chunk) => {
      rspStr = rspStr + chunk;
    });
    res.on('end', () => {
      apiRsp.statusCode = res.statusCode;
      apiRsp.json(JSON.parse(rspStr));
    });
  });
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  // Write data to request body
  req.write(reqJson);
  req.end();

})

app.post(endpoint3,(apiReq, apiRsp) => {
  console.log('Write api/questions/:qID/link hit, forwarding to verify service..')
  var reqJson= JSON.stringify(apiReq.body)
  postNginxService.headers = {
    'Content-Type': 'application/json',
    'Content-Length': reqJson.length
  }
  if (typeof apiReq.get('RightToAsk-Auth') !== 'undefined') {
    postNginxService.headers = {
      'RightToAsk-Timestamp': apiReq.get('RightToAsk-Timestamp'),
      'RightToAsk-Auth': apiReq.get('RightToAsk-Auth'),
      'RightToAsk-Username': apiReq.get('RightToAsk-Username'),
      'Content-Type': 'application/json',
      'Content-Length': reqJson.length
    }
  }

  postNginxService.path = '/auth/write-service/questions/' + apiReq.params.qID + '/links';
  const req = http.request(postNginxService, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    
    var rspStr = ''
    res.on('data', (chunk) => {
      rspStr = rspStr + chunk;
    });
    res.on('end', () => {
      apiRsp.statusCode = res.statusCode;
      apiRsp.json(JSON.parse(rspStr));
    });
  });
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  // Write data to request body
  req.write(reqJson);
  req.end();

})

https.createServer(serverConfig,app).listen(PORT, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	console.log('');
        console.log(`WRITE micro-service listening on `+ add + `:${PORT}`)
     })
})
