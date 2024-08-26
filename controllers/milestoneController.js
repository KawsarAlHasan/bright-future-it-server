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
