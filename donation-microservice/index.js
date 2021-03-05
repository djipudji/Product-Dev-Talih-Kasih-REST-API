const express = require('express');
const bodyParser = require('body-parser');
const donationRoutes = require ('./routes/donationRoutes.js')
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(express.static('public'));

app.use('/', donationRoutes)

app.listen(3002, () => {
    console.log('Donation running on port 3002');
})