const express           = require('express');
const bodyParser        = require('body-parser');
const UserController    = require(process.env.COMMON_PATH + '/controllers/userController');

const app = express();
const PORT = process.env.INCOMING_PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Log request
app.post('*', (req, res, next) => {
    console.log(`Register service recieved POST request to ${req.url}`);
    next();
});

app.post('/register-service', UserController.validateCreateUser, UserController.createUser);

app.listen(PORT, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log(`Express server listening on `+ add + `:${PORT}`)
     })
})
