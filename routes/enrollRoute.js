const express = require("express");
const {
  createPayment,
  ceckPayment,
  getAllPayments,
  statusUpadate,
  getSinglePayment,
} = require("../controllers/enrollController");
const verifyadmin = require("../middleware/verifyadmin");

const router = express.Router();

router.post("/create", createPayment);
router.get("/check", ceckPayment);
router.get("/all", verifyadmin, getAllPayments); // this is for admin
router.get("/:id", verifyadmin, getSinglePayment); // this is for admin
router.put("/status-update", verifyadmin, statusUpadate); // this is for admin

module.exports = router;
