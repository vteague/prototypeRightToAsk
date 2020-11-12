const express = require('express')
const ip = require("ip");
const bodyParser = require('body-parser');
const crypto = require('crypto');
var RSAKey = require('react-native-rsa');
const bigInt = require('big-integer');

const app = express()
const port = 3001

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/keys', (req, rsp) => {
    const bits = 2048;
    const exponent = '10001';
    const rsa = new RSAKey();
    rsa.generate(bits, exponent);
    const privateKey = JSON.parse(rsa.getPrivateString());
    const keyString = {
        'priKey': `${privateKey.d}`,
        'pubKey': `${privateKey.n}`
    }
    //console.log(keyString)
    rsp.send(keyString)
})
app.post('/sign', (req, res) => {
  //  console.log(req.body.msg)
    var hash = crypto.createHash('sha512').update(req.body.msg).digest('hex');
    var bi = new bigInt(hash, 16);
    var mod = new bigInt(req.body.pubKey, 16);
    var exp = new bigInt(req.body.priKey, 16);
    var e = new bigInt("10001", 16);
    const sign = bi.modPow(exp, mod)
  //  console.log('Signature : ', sign.toString(16))
  //  console.log('Created Hash : ', hash)
  //  console.log("Verified value = " + sign.modPow(e, mod).toString(16))
    var payload =  { sign : `${sign.toString(16)}` }
    res.status(200).json(payload)
})

app.listen(port, () => {
    console.log(`RSA server listening on `+ ip.address() + `:${port}`)
})
