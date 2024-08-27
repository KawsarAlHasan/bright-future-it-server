const express = require("express");
const {
  createPayment,
  ceckPayment,
} = require("../controllers/enrollController");

const router = express.Router();

router.post("/create", createPayment);
router.get("/all", ceckPayment);

module.exports = router;
