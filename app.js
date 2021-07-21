const express = require("express");
const app = express();
const cors = require("cors");
const expressValidator = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

const jobRoute = require("./routes/job");
const tableRoute = require("./routes/table");
const jobReport = require("./routes/report");

app.use(cors());
app.use(express.static('front-end'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(expressValidator());

app.use("/api", jobRoute);
app.use("/api", tableRoute);
app.use("/api", jobReport);

app.listen(process.env.PORT, (err) => {
    console.log("Running on port 5002");
})
