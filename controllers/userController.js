const db = require("../config/db");
const { generateUserToken } = require("../config/userToken");
const bcrypt = require("bcrypt");

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM users");

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No User found",
        data: data[0],
      });
    }

    res.status(200).send({
      success: true,
      message: "All Users",
      totalUsers: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Users",
      error: error.message,
    });
  }
};

// signup
exports.signupUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [data] = await db.query(
      `INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)`,
      [name, phone, email, hashedPassword]
    );

    if (!data.insertId) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    const [results] = await db.query(`SELECT * FROM users WHERE id=?`, [
      data.insertId,
    ]);
    const users = results[0];
    const token = generateUserToken(users);

    res.status(200).send({
      success: true,
      message: "User created successfully",
      data: {
        user: users,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Sign",
      error: error.message,
    });
  }
};

// get single user by id
exports.getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).send({
        success: false,
        message: "User ID is required in params",
      });
    }

    const [data] = await db.query(`SELECT * FROM users WHERE id=? `, [userId]);
    if (!data || data.length === 0) {
      return res.status(200).send({
        success: false,
        message: "No user found",
      });
    }
    res.status(200).send(data[0]);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting user",
      error: error.message,
    });
  }
};

// users login
exports.usersLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        error: "Please provide your credentials",
      });
    }
    const [results] = await db.query(`SELECT * FROM users WHERE email=?`, [
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
    const token = generateUserToken(users);
    const { password: pwd, ...usersWithoutPassword } = users;
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        user: usersWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "User Login Unseccess",
      error: error.message,
    });
  }
};

// get me User
exports.getMeUsers = async (req, res) => {
  try {
    const decodeduser = req.decodedUser;
    res.status(200).json(decodeduser);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// update user
exports.userUpdate = async (req, res) => {
  try {
    const { id, profilePic } = req.decodedUser;

    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(404).send({
        success: false,
        message: "Name and phone is requied in body",
      });
    }

    const images = req.file;

    let proPic = profilePic;
    if (images && images.path) {
      proPic = `/public/images/${images.filename}`;
    }

    const [data] = await db.query(
      `UPDATE users SET name=?, phone=?, profilePic=? WHERE id =?`,
      [name, phone, proPic, id]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update Users ",
      });
    }
    res.status(200).send({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update User ",
      error: error.message,
    });
  }
};

// user password update
exports.updateUserPassword = async (req, res) => {
  try {
    const { id, password } = req.decodedUser;

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(404).send({
        success: false,
        message: "Old Password and New Password is requied in body",
      });
    }

    const isMatch = await bcrypt.compare(old_password, password);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        error: "Your Old Password is not correct",
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    const [result] = await db.query(`UPDATE users SET password=? WHERE id =?`, [
      hashedPassword,
      id,
    ]);

    if (!result) {
      return res.status(403).json({
        success: false,
        error: "Something went wrong",
      });
    }

    res.status(200).send({
      success: true,
      message: "User password updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in password Update User",
      error: error.message,
    });
  }
};

exports.userStatusUpadate = async (req, res) => {
  try {
    const { status, userId } = req.body;
    if (!status || !userId) {
      return res.status(500).send({
        success: false,
        message: "status and userId is required in body",
      });
    }

    const [data] = await db.query(`UPDATE users SET status=? WHERE id=?`, [
      status,
      userId,
    ]);

    res.status(200).send({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in User status update",
      error: error.message,
    });
  }
};
