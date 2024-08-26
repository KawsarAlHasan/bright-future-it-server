const express = require("express");
const { getAllMilestone } = require("../controllers/milestoneController");

const router = express.Router();

router.get("/all", getAllMilestone);

module.exports = router;
