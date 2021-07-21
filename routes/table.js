const express = require("express");
const router = express.Router();

const {getJobData, searchJobData, getAllJobData, submitJobData} = require("../controllers/table");

router.get("/job-data", getJobData);

router.get("/search-job-data", searchJobData)
// first get request
router.get("/get-all-table-data", getAllJobData);

router.post("/submit-data",  submitJobData);
module.exports = router;
