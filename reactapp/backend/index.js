const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
require('dotenv').config();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


require("./routes")(app);
db.sequelize.sync({
    //force: true
}).then(() => {
    console.log("db resync");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});