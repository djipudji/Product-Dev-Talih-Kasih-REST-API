const path = require('path');
require('dotenv').config({
    path: `./environments/.env.${process.env.NODE_ENV}`
})
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

const comment = require('./comment.js');

module.exports = { comment };