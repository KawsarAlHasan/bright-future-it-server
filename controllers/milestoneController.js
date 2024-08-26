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

// create milestone
// exports.createMilestone = async (req, res) => {
//   try {
//     const { name, phone, email, password } = req.body;

//     if (!name || !phone || !email || !password) {
//       return res.status(500).send({
//         success: false,
//         message: "Please provide all fields",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [data] = await db.query(
//       `INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)`,
//       [name, phone, email, hashedPassword]
//     );

//     if (!data.insertId) {
//       return res.status(404).send({
//         success: false,
//         message: "Error in INSERT QUERY",
//       });
//     }

//     const [results] = await db.query(`SELECT * FROM users WHERE id=?`, [
//       data.insertId,
//     ]);
//     const users = results[0];
//     const token = generateUserToken(users);

//     res.status(200).send({
//       success: true,
//       message: "User created successfully",
//       data: {
//         user: users,
//         token,
//       },
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error in Sign",
//       error: error.message,
//     });
//   }
// };

// // get single user by id
// exports.getSingleUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     if (!userId) {
//       return res.status(404).send({
//         success: false,
//         message: "User ID is required in params",
//       });
//     }

//     const [data] = await db.query(`SELECT * FROM users WHERE id=? `, [userId]);
//     if (!data || data.length === 0) {
//       return res.status(200).send({
//         success: false,
//         message: "No user found",
//       });
//     }
//     res.status(200).send(data[0]);
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error in getting user",
//       error: error.message,
//     });
//   }
// };

// // update user
// exports.userUpdate = async (req, res) => {
//   try {
//     const { id, profilePic } = req.decodedUser;

//     const { name, phone } = req.body;
//     if (!name || !phone) {
//       return res.status(404).send({
//         success: false,
//         message: "Name and phone is requied in body",
//       });
//     }

//     const images = req.file;

//     let proPic = profilePic;
//     if (images && images.path) {
//       proPic = `/public/images/${images.filename}`;
//     }

//     const [data] = await db.query(
//       `UPDATE users SET name=?, phone=?, profilePic=? WHERE id =?`,
//       [name, phone, proPic, id]
//     );
//     if (!data) {
//       return res.status(500).send({
//         success: false,
//         message: "Error in update Users ",
//       });
//     }
//     res.status(200).send({
//       success: true,
//       message: "User updated successfully",
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error in Update User ",
//       error: error.message,
//     });
//   }
// };
