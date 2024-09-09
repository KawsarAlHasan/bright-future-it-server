const express = require("express");

const { adminLogin, getMeAdmin } = require("../controllers/adminController");
const verifyadmin = require("../middleware/verifyadmin");

const router = express.Router();

router.get("/me", verifyadmin, getMeAdmin);
router.post("/login", adminLogin);

// router.put("/update-password", verifyUsers, updateUserPassword);

module.exports = router;
