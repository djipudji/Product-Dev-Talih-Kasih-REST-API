const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const commentRoutes = require('./routes/commentRoutes.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(express.static('public'));

app.use('/comment', commentRoutes);

app.listen(3004, () => console.log("Server comment running on http://localhost:3004"))