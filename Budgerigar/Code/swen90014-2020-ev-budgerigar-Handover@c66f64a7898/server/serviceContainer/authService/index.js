const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { Client } = require('pg');
const bigInt = require('big-integer');

async function verify(username, message, signature) {
  if (username == undefined) {
    console.log(`username is undefined`)
    return false
  }

  var userRepo = new userRepository(client);
  let uDetails = {username:username};
  let user = await userRepo.getUsers(uDetails);
  var publicKey
  if (user != null){
        publicKey = user.publicKey
  }
  else {
        console.log(`username: ${username} does not exist`)
        return false
  }

  //console.log(`uDetails: ${JSON.stringify(uDetails)}\n`);
  //console.log(`publickey: ${publicKey}\n`)

  var hash = crypto.createHash('sha512').update(message).digest('hex');

  var sig = new bigInt(signature, 16);
  var mod = new bigInt(publicKey, 16);
  var exp = new bigInt("10001", 16);

  //console.log("--DEBUG VERIFICATION--");
  //console.log(`datablob: ${message}\n`);
  //console.log(`hash: ${hash}\n`);

  //console.log(`sig: ${sig.toString(16)}`);
  //console.log(`exp: ${exp.toString(16)}`);
  //console.log(`mod: ${mod.toString(16)}\n`);
  
  //console.log(`hash: ${hash}`);
  //console.log(`ver : ${sig.modPow(exp, mod).toString(16)}\n`);
  //console.log("--END DEBUG--");

  return sig.modPow(exp, mod).equals(new bigInt(hash, 16));
};

function verify_forward(apiReq, apiRsp, path, options) {
  var reqJson = JSON.stringify(apiReq.body)
  var reqAuth = apiReq.get("RightToAsk-Auth");
  var reqTime = apiReq.get("RightToAsk-Timestamp");
  var reqUser = apiReq.get("RightToAsk-Username");
  var reqMsg = "v0:"+reqTime+":"+reqJson;

  console.log(`Verifying request sent to ${apiReq.url} to pass to ${path}`);

  (async function() {
    var verifyResult = false;

    if (apiReq.body['username'] == undefined || apiReq.body['username'] == reqUser) {
      var verifyResult = await verify(reqUser, reqMsg, reqAuth);
    }

    if (verifyResult) {
      options.headers = {
          'Content-Type': 'application/json',
          'Content-Length': reqJson.length
      }
      options.path = path;
      const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        var rspStr = ''
        res.on('data', (chunk) => {
          rspStr = rspStr + chunk
        });
        res.on('end', () => {
            // Pass response back through
            apiRsp.statusCode = res.statusCode;
            apiRsp.json(JSON.parse(rspStr));     
          });
      })
      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });
      req.write(reqJson);
      req.end();
    } else {
      //Verification Failed
      apiRsp.statusCode = 401;
      apiRsp.json("Signature Mismatch");
    }
  })();
}

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
})


const app = express();
const PORT = 9081;

const optionsSync = {
  hostname: 'nginx_service',
  port: 80,
  method: 'GET',
}

const optionsWrite = {
  hostname: 'write_service',
  port: 9080,
  method: 'POST',
}
const optionsWriteDel = {
  hostname: 'write_service',
  port: 9080,
  method: 'DELETE',
}

const userRepository = require(process.env.COMMON_PATH + '/repositories/userRepository')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

client.connect()
  .then(() => console.log('connected to Postgresql db'))
  .catch(err => {
    console.error('connection with db : error', err.stack)
    process.exit(1)
  })

/* Verify and Forward request to post a new question */
app.post('/auth/write-service/questions', (apiReq, apiRsp) => {
  verify_forward(apiReq, apiRsp, '/questions', optionsWrite);
});

/* Verify and Forward request to post an answer */
app.post('/auth/write-service/questions/:qID/answers', (apiReq, apiRsp) => {
  verify_forward(apiReq, apiRsp, '/questions/' + apiReq.params.qID + '/answers', optionsWrite);
})

/* Verify and Forward request to post a link */
app.post('/auth/write-service/questions/:qID/links', (apiReq, apiRsp) => {
  verify_forward(apiReq, apiRsp, '/questions/' + apiReq.params.qID + '/links', optionsWrite);
});

app.get('/auth/sync-service/sync', (apiReq, apiRsp) => {
  verify_forward(apiReq, apiRsp, '/sync-service/sync?last_sync=' + apiReq.query.last_sync, optionsSync);
})

/* Verify and Forward request for MP verification */
app.post('/auth/verify', (apiReq, apiRsp) => {
  verify_forward(apiReq, apiRsp, '/verify', optionsWrite);
});

/* Verify and Forward request for MP verification proof */
app.post('/auth/verify/:code', (apiReq, apiRsp) => {
  verify_forward(apiReq, apiRsp, '/verify/' + apiReq.params.code, optionsWrite);
});

/* Verify and Forward request for deleting a user */
app.delete('/auth/users/:id', (apiReq, apiRsp) => {
  verify_forward(apiReq, apiRsp, '/users/' + apiReq.params.id, optionsWriteDel);
});

/* Verify and Forward request for casting vote */
app.post('/auth/users/:id/votes', (apiReq, apiRsp) => {
  verify_forward(apiReq, apiRsp, '/users/' + apiReq.params.id + '/votes', optionsWrite);
});


app.listen(PORT, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log(`Express server listening on `+ add + `:${PORT}`)
     })
});
