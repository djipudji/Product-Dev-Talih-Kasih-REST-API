const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const userRoutes = require('./routes/userRoutes.js');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'log')
});

function assignId(req, res, next) {
    req.id = uuidv4();
    next();
};

morgan.token('id', function (req) {
    return req.id
});

morgan.token('time', function () {
    let date = new Date();
    let dateToLocale = date.toLocaleString('id-ID', {timeZone: 'Asia/Jakarta'});
    return dateToLocale;
});

morgan.token('user', function (req, res) {
    if (req.user) {
        return req.user.email;
    } else if (req.header('Authorization')) {
        let header = req.header('Authorization');
        let getToken = header.split(' ');
        let token = getToken[1];
        let decoded = jwt.decode(token);

        return decoded.user.email
    } else if (req.body.email) {
        return req.body.email;
    } else if (req.params.token) {
        let token = req.params.token;
        let decoded = jwt.decode(token);

        return decoded.user.email;
    } else {
        return 'No user info'
    }
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(express.static('public'));

app.use(assignId);

app.use(morgan(':id || :time (WIB) || :user || :method || 3000:url || :status || "HTTP/:http-version" || :user-agent', { stream: accessLogStream }));

app.use('/user', userRoutes);

app.listen(3000, () => console.log("Server user running on http://localhost:3000"))