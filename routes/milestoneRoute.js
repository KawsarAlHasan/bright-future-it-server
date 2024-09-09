const express = require("express");
const {
  getAllMilestone,
  getMileStone,
  getModule,
  getTopics,
  updateMileStone,
  updateModule,
  updateTopics,
  createMilestone,
  createTopics,
  createModule,
  deleteMileStone,
  deleteModule,
  deleteTopics,
} = require("../controllers/milestoneController");
const verifyadmin = require("../middleware/verifyadmin");

const router = express.Router();

router.get("/all", getAllMilestone);

router.get("/milestones", verifyadmin, getMileStone);
router.post("/milestones", verifyadmin, createMilestone);
router.put("/update/:id", verifyadmin, updateMileStone);
router.delete("/delete/:id", verifyadmin, deleteMileStone);

router.get("/modules", verifyadmin, getModule);
router.post("/modules", verifyadmin, createModule);
router.put("/modules/update/:id", verifyadmin, updateModule);
router.delete("/modules/delete/:id", verifyadmin, deleteModule);

router.get("/topics", verifyadmin, getTopics);
router.post("/topics", verifyadmin, createTopics);
router.put("/topics/update/:id", verifyadmin, updateTopics);
router.delete("/topics/delete/:id", verifyadmin, deleteTopics);

module.exports = router;
