const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');
const {
    SERVICE,
    EMAIL,
    PASSWORD,
} = process.env
var privateKey = fs.readFileSync('privkey.pem')
var certificate = fs.readFileSync('fullchain.pem')
var serverConfig = {
	key : privateKey,
	cert : certificate
};


const PORT = 8080;
const registrationEndpoint = '/api/users'
const mpValidation = '/api/users/verify'
const uidValidation = '/api/users/verify/:code'
const deleteUser = '/api/users/:id'
const endpointVotes = '/api/users/:id/votes'
const delNginxService = {
  hostname: 'nginx_service',
  port: 80,
  method: 'DELETE',
}
const postNginxService = {
  hostname: 'nginx_service',
  port: 80,
  method: 'POST',
}
const options1 = {
    hostname: 'register_service',
    port: 9080,
    path: '/register-service',
    method: 'POST'
}
const verifyMP = {
  hostname: 'nginx_service',
  port: 80,
  path: '/auth/verify',
  method: 'POST',
}
const verifyUID = {
  hostname: 'nginx_service',
  port: 80,
  method: 'POST',
}
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post(registrationEndpoint,(apiReq, apiRsp) => {
    console.log('Register RestAPI hit, forwarding to Register service..')
    var reqJson= JSON.stringify(apiReq.body)
    options1.headers= {
        'Content-Type': 'application/json',
        'Content-Length' : reqJson.length
    }

    const req = http.request(options1, (res) => {
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
/**
 * Send to auth service
 *  - auth sends to write, write service responds with a json
 *  - auth proxies json back to api
 *  
*/
app.post(uidValidation, (apiReq, apiRsp) => {
  console.log('Email utility received a request..')
  var code = apiReq.params.code
  var reqJson= JSON.stringify(apiReq.body)
  verifyUID.path = '/auth/verify/' + code
  verifyUID.headers= {
        'Content-Type': 'application/json',
        'Content-Length' : reqJson.length
  }
  if (typeof apiReq.get('RightToAsk-Auth') !== 'undefined') {
    verifyUID.headers = {
      'RightToAsk-Timestamp': apiReq.get('RightToAsk-Timestamp'),
      'RightToAsk-Auth': apiReq.get('RightToAsk-Auth'),
      'RightToAsk-Username': apiReq.get('RightToAsk-Username'),
      'Content-Type': 'application/json',
      'Content-Length': reqJson.length
    }
  }

  const req = http.request(verifyUID, (res) => {
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
  apiRsp.status(200)
  
})

/**
 * Send to auth service
 *  - auth sends to write, write service responds with a json
 *  - auth proxies json back to api
  */
app.post(mpValidation, (apiReq, apiRsp) => {
  console.log('Received MP verification request..')
  var reqJson= JSON.stringify(apiReq.body)
  verifyMP.headers= {
      'Content-Type': 'application/json',
      'Content-Length' : reqJson.length
  }
  if (typeof apiReq.get('RightToAsk-Auth') !== 'undefined') {
    verifyMP.headers = {
      'RightToAsk-Timestamp': apiReq.get('RightToAsk-Timestamp'),
      'RightToAsk-Auth': apiReq.get('RightToAsk-Auth'),
      'RightToAsk-Username': apiReq.get('RightToAsk-Username'),
      'Content-Type': 'application/json',
      'Content-Length': reqJson.length
    }
  }
  verifyMP.path = '/auth/verify'
  //send to auth
  const req = http.request(verifyMP, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    var rspStr = ''
    res.on('data', (chunk) => {
      console.log(rspStr)
      rspStr = rspStr + chunk;
    });
    res.on('end', () => {
      if (res.statusCode != 200) {
        apiRsp.statusCode = res.statusCode;
        apiRsp.json(JSON.parse(rspStr));
      }
      else{
        body = JSON.parse(rspStr);
        var to = body.email
        var code = body.code
       
        //Create email transport service
        tr = nodemailer.createTransport({
          service: `${SERVICE}`,
          auth: {
              user: `${EMAIL}`,
              pass: `${PASSWORD}`,
          }
        });
        
        //Create email with required properties
        mailOptions = {
          from: `${EMAIL}`,
          to: to,
          subject: 'Evoting App - MP Verification code',
          text:`Your verification code is ${code}`
        }
        //send the email
        tr.sendMail(mailOptions, function(err,data){
          if(err){
            console.log(err);
            console.log('Error sending email')
          }else{  
            console.log('email sent')
            //apiRsp.status(200).json({code:`${code}`}) /* lol */
            apiRsp.status(200).send()
          }
        })
      }         
    });
  });
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  // Write data to request body
  req.write(reqJson);
  req.end();

})

app.delete(deleteUser,(apiReq, apiRsp) => {
  console.log('Write - delete user api hit, forwarding to verify service..')
  var reqJson= JSON.stringify(apiReq.body)
  delNginxService.headers = {
    'Content-Type': 'application/json',
    'Content-Length': reqJson.length
  }
  if (typeof apiReq.get('RightToAsk-Auth') !== 'undefined') {
    delNginxService.headers = {
      'RightToAsk-Timestamp': apiReq.get('RightToAsk-Timestamp'),
      'RightToAsk-Auth': apiReq.get('RightToAsk-Auth'),
      'RightToAsk-Username': apiReq.get('RightToAsk-Username'),
      'Content-Type': 'application/json',
      'Content-Length': reqJson.length
    }
  }

  delNginxService.path = '/auth/users/' + apiReq.params.id ;
  const req = http.request(delNginxService, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    var rspStr = ''
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
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

app.post(endpointVotes,(apiReq, apiRsp) => {
  console.log('Write - votes api hit, forwarding to verify service..')
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

  postNginxService.path = '/auth/users/' + apiReq.params.id + '/votes/' ;
  const req = http.request(postNginxService, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    var rspStr = ''
    res.on('data', (chunk) => {
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



https.createServer(serverConfig,app).listen(PORT, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('');
    console.log(`REGISTER micro-service listening on `+ add + `:${PORT}`)
    })
})
