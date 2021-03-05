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
}) // Connect to mongodb database

const campaign = require('./campaign.js'); // Import campaign model
const history = require('./history.js')

module.exports = {
    campaign,
    history
}; // Export campaign model
