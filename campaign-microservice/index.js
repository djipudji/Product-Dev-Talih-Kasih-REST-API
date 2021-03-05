const express = require('express'); // Import express
const bodyParser = require('body-parser'); // Import body-parser
const campaignRoutes = require('./routes/campaignRoutes'); // Import campaignRoutes
const historyRoutes = require('./routes/historyRoutes.js')
const cors = require('cors');

const app = express(); // Make express app

//Set body parser for HTTP post operation
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

app.use(cors());

//set static assets to public directory
app.use(express.static('public'));

app.use('/campaign', campaignRoutes); // If access localhost:3002, it will be go to campaignRoutes
app.use('/history', historyRoutes)


// Server running on port 3001
app.listen(3001, () => {
  console.log('Campaign running on port 3001! its time to (bernyanyi-bernyanyi)');
})
