const db = require("../config/db");
const { generateAdminToken } = require("../config/adminToken");
const bcrypt = require("bcrypt");

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        error: "Please provide your credentials",
      });
    }
    const [results] = await db.query(`SELECT * FROM admin WHERE email=?`, [
      email,
    ]);
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Email and Password is not correct",
      });
    }
    const users = results[0];
    const isMatch = await bcrypt.compare(password, users.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Email and Password is not correct",
      });
    }
    const token = generateAdminToken(users);
    const { password: pwd, ...adminLoginWithOutPassword } = users;
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        user: adminLoginWithOutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "admin Login Unseccess",
      error: error.message,
    });
  }
};

// get me Admin
exports.getMeAdmin = async (req, res) => {
  try {
    const decodedadmin = req.decodedAdmin;
    res.status(200).json(decodedadmin);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

//   // update user
//   exports.userUpdate = async (req, res) => {
//     try {
//       const { id, profilePic } = req.decodedUser;

//       const { name, phone } = req.body;
//       if (!name || !phone) {
//         return res.status(404).send({
//           success: false,
//           message: "Name and phone is requied in body",
//         });
//       }

//       const images = req.file;

//       let proPic = profilePic;
//       if (images && images.path) {
//         proPic = `/public/images/${images.filename}`;
//       }

//       const [data] = await db.query(
//         `UPDATE users SET name=?, phone=?, profilePic=? WHERE id =?`,
//         [name, phone, proPic, id]
//       );
//       if (!data) {
//         return res.status(500).send({
//           success: false,
//           message: "Error in update Users ",
//         });
//       }
//       res.status(200).send({
//         success: true,
//         message: "User updated successfully",
//       });
//     } catch (error) {
//       res.status(500).send({
//         success: false,
//         message: "Error in Update User ",
//         error: error.message,
//       });
//     }
//   };

//   // user password update
//   exports.updateUserPassword = async (req, res) => {
//     try {
//       const { id, password } = req.decodedUser;

//       const { old_password, new_password } = req.body;

//       if (!old_password || !new_password) {
//         return res.status(404).send({
//           success: false,
//           message: "Old Password and New Password is requied in body",
//         });
//       }

//       const isMatch = await bcrypt.compare(old_password, password);

//       if (!isMatch) {
//         return res.status(403).json({
//           success: false,
//           error: "Your Old Password is not correct",
//         });
//       }

//       const hashedPassword = await bcrypt.hash(new_password, 10);
//       const [result] = await db.query(`UPDATE users SET password=? WHERE id =?`, [
//         hashedPassword,
//         id,
//       ]);

//       if (!result) {
//         return res.status(403).json({
//           success: false,
//           error: "Something went wrong",
//         });
//       }

//       res.status(200).send({
//         success: true,
//         message: "User password updated successfully",
//       });
//     } catch (error) {
//       res.status(500).send({
//         success: false,
//         message: "Error in password Update User",
//         error: error.message,
//       });
//     }
//   };
