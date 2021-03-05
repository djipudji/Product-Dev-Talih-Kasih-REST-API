const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const updateRoutes = require ('./routes/updateRoutes.js')
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(express.static('public'));
app.use('/update', updateRoutes)

app.listen(3003, () => {
    console.log('update running on port 3003');
})