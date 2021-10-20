require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8888;

const app = express();

app.listen(9999, () => {
    console.log(`server is running on port ${port}...`);
});
