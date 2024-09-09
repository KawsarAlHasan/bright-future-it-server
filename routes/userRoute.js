const express = require("express");
const {
  getAllUsers,
  signupUser,
  userUpdate,
  getMeUsers,
  usersLogin,
  getSingleUser,
  updateUserPassword,
  userStatusUpadate,
} = require("../controllers/userController");
const verifyUsers = require("../middleware/verifyuser");
const uploadImage = require("../middleware/imagesUploader");
const verifyadmin = require("../middleware/verifyadmin");

const router = express.Router();

router.get("/all", verifyadmin, getAllUsers);
router.get("/me", verifyUsers, getMeUsers);
router.get("/:id", verifyUsers, getSingleUser);
router.post("/signup", signupUser);
router.post("/login", usersLogin);
router.put(
  "/update",
  uploadImage.single("profilePic"),
  verifyUsers,
  userUpdate
);
router.put("/update-password", verifyUsers, updateUserPassword);
router.put("/status-update", verifyadmin, userStatusUpadate);

module.exports = router;
