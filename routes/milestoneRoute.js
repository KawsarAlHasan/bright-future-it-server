const express = require("express");
const { getAllMilestone } = require("../controllers/MilestoneController");

const router = express.Router();

router.get("/all", getAllMilestone);

module.exports = router;
