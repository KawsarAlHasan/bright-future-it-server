const express = require("express");
const {
  getAllCourses,
  getSingleCourse,
} = require("../controllers/coursesController");

const router = express.Router();

router.get("/all", getAllCourses);
router.get("/:id", getSingleCourse);

module.exports = router;
