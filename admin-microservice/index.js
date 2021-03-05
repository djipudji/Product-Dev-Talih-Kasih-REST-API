const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    adminRoutes = require('./routes/adminRoutes.js');

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(express.static('public'));

app.use('/admin', adminRoutes);

app.listen(3005, () => console.log(`Server admin running on http://localhost:3005`));