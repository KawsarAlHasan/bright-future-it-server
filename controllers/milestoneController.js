const db = require("../config/db");

// get all Milestone
exports.getAllMilestone = async (req, res) => {
  try {
    // Query to get all milestones
    const [data] = await db.query(`SELECT * FROM milestones;`);

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Milestone found",
        data: [],
      });
    }

    // Query to get modules associated with a milestone
    const moduleQuery = "SELECT * FROM modules WHERE MilestoneID = ?";

    // Query to get topics associated with a module
    const topicQuery = "SELECT TopicName FROM topics WHERE ModuleID = ?";

    // Fetch modules and topics for each milestone
    const milestoneWithModulesAndTopics = await Promise.all(
      data.map(async (stone) => {
        // Fetch modules for the current milestone
        const [modules] = await db.query(moduleQuery, [stone.MilestoneID]);

        const totalModules = modules.length;
        const completedModules = modules.filter(
          (module) => module.isComplete
        ).length;
        const incompleteModules = totalModules - completedModules;

        const percentComplete = (completedModules / totalModules) * 100;

        // Fetch topics for each module
        const modulesWithTopics = await Promise.all(
          modules.map(async (module) => {
            const [topics] = await db.query(topicQuery, [module.ModuleID]);
            return { ...module, topics: topics };
          })
        );

        return {
          ...stone,
          complete: percentComplete,
          modules: modulesWithTopics,
        };
      })
    );

    // Send the response with milestones, modules, and topics
    res.status(200).send({
      success: true,
      message: "All Milestones with Modules and Topics",
      data: milestoneWithModulesAndTopics,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Milestones",
      error: error.message,
    });
  }
};

// get milestone
exports.getMileStone = async (req, res) => {
  try {
    const [data] = await db.query(`SELECT * FROM milestones;`);
    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Milestone found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Milestones",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get Milestones",
      error: error.message,
    });
  }
};

// create milestone
exports.createMilestone = async (req, res) => {
  try {
    const { MilestoneName } = req.body;

    if (!MilestoneName) {
      return res.status(500).send({
        success: false,
        message: "MilestoneName is requird in body",
      });
    }

    const [result] = await db.query(
      `INSERT INTO milestones (MilestoneName)
           VALUES (?)`,
      [MilestoneName]
    );
    res.status(200).send({
      success: true,
      message: "Milestone inserted successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Database error",
      error: error.message,
    });
  }
};

// delete milestone
exports.deleteMileStone = async (req, res) => {
  try {
    const MilestoneID = req.params.id;
    if (!MilestoneID) {
      return res.status(404).send({
        success: false,
        message: "MilestoneID is required in params",
      });
    }

    await db.query(`DELETE FROM topics WHERE MilestoneID=?`, [MilestoneID]);
    await db.query(`DELETE FROM modules WHERE MilestoneID=?`, [MilestoneID]);
    await db.query(`DELETE FROM milestones WHERE MilestoneID=?`, [MilestoneID]);

    res.status(200).send({
      success: true,
      message: "Milestone Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete Milestone",
      error: error.message,
    });
  }
};

// update mileston
exports.updateMileStone = async (req, res) => {
  try {
    const MilestoneID = req.params.id;
    if (!MilestoneID) {
      return res.status(500).send({
        success: false,
        message: "MilestoneID is required in params",
      });
    }

    const { MilestoneName } = req.body;
    if (!MilestoneName) {
      return res.status(500).send({
        success: false,
        message: "MilestoneName is required in body",
      });
    }

    const [data] = await db.query(
      `UPDATE milestones SET MilestoneName=? WHERE MilestoneID=?`,
      [MilestoneName, MilestoneID]
    );

    res.status(200).send({
      success: true,
      message: "Milestone Name updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Milestone Name update",
      error: error.message,
    });
  }
};

// get module
exports.getModule = async (req, res) => {
  try {
    const { milestoneid } = req.query;
    const [data] = await db.query(
      `SELECT * FROM modules WHERE MilestoneID=?;`,
      [milestoneid]
    );

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Modules found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Modules",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get Modules",
      error: error.message,
    });
  }
};

// create module
exports.createModule = async (req, res) => {
  try {
    const { ModuleName, MilestoneID } = req.body;
    if (!ModuleName || !MilestoneID) {
      return res.status(500).send({
        success: false,
        message: "ModuleName is required in body",
      });
    }

    const [result] = await db.query(
      `INSERT INTO modules (ModuleName, MilestoneID)
           VALUES (?, ?)`,
      [ModuleName, MilestoneID]
    );
    res.status(200).send({
      success: true,
      message: "Module inserted successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Database error",
      error: error.message,
    });
  }
};

// delete module
exports.deleteModule = async (req, res) => {
  try {
    const ModuleID = req.params.id;
    if (!ModuleID) {
      return res.status(404).send({
        success: false,
        message: "ModuleID is required in params",
      });
    }

    await db.query(`DELETE FROM topics WHERE ModuleID=?`, [ModuleID]);
    await db.query(`DELETE FROM modules WHERE ModuleID=?`, [ModuleID]);

    res.status(200).send({
      success: true,
      message: "Module Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete Module",
      error: error.message,
    });
  }
};

// update module
exports.updateModule = async (req, res) => {
  try {
    const ModuleID = req.params.id;
    if (!ModuleID) {
      return res.status(500).send({
        success: false,
        message: "ModuleID is required in params",
      });
    }

    const { ModuleName } = req.body;
    if (!ModuleName) {
      return res.status(500).send({
        success: false,
        message: "ModuleName is required in body",
      });
    }

    const [data] = await db.query(
      `UPDATE modules SET ModuleName=? WHERE ModuleID=?`,
      [ModuleName, ModuleID]
    );

    res.status(200).send({
      success: true,
      message: "Module Name updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Module Name update",
      error: error.message,
    });
  }
};

// get topics
exports.getTopics = async (req, res) => {
  try {
    const { moduleID } = req.query;
    const [data] = await db.query(`SELECT * FROM topics WHERE ModuleID=?;`, [
      moduleID,
    ]);

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Topics found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Topics",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get Topics",
      error: error.message,
    });
  }
};

// create topics
exports.createTopics = async (req, res) => {
  try {
    const { TopicName, ModuleID } = req.body;
    if (!TopicName || !ModuleID) {
      return res.status(500).send({
        success: false,
        message: "TopicName is required in body",
      });
    }

    const [result] = await db.query(
      `INSERT INTO topics (TopicName, ModuleID)
           VALUES (?, ?)`,
      [TopicName, ModuleID]
    );
    res.status(200).send({
      success: true,
      message: "Topics inserted successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Database error",
      error: error.message,
    });
  }
};

// delete topics
exports.deleteTopics = async (req, res) => {
  try {
    const TopicID = req.params.id;
    if (!TopicID) {
      return res.status(404).send({
        success: false,
        message: "TopicID is required in params",
      });
    }

    await db.query(`DELETE FROM topics WHERE TopicID=?`, [TopicID]);

    res.status(200).send({
      success: true,
      message: "topics Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete topics",
      error: error.message,
    });
  }
};

// update topics
exports.updateTopics = async (req, res) => {
  try {
    const TopicID = req.params.id;
    if (!TopicID) {
      return res.status(500).send({
        success: false,
        message: "TopicID is required in params",
      });
    }

    const { TopicName } = req.body;
    if (!TopicName) {
      return res.status(500).send({
        success: false,
        message: "TopicName is required in body",
      });
    }

    const [data] = await db.query(
      `UPDATE topics SET TopicName=? WHERE TopicID=?`,
      [TopicName, TopicID]
    );

    res.status(200).send({
      success: true,
      message: "Topic Name updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Topic Name update",
      error: error.message,
    });
  }
};
