const express = require("express");

const verifyadmin = require("../middleware/verifyadmin");
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getSingleProject,
} = require("../controllers/liveProjectContoller");

const router = express.Router();

router.get("/all/:id", getAllProjects);
router.get("/single/:id", getSingleProject);
router.post("/create", createProject);
router.put("/update/:id", updateProject);
router.delete("/delete/:id", deleteProject);

module.exports = router;
