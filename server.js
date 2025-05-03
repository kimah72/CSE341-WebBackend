require("dotenv").config();
const express = require("express");
const connectDB = require("./database");
const app = express();
const port = process.env.PORT || 3000;

connectDB();
app.use(express.json());
app.use('/', require('./routes'));

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});