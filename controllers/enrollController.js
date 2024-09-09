const db = require("../config/db");

exports.createPayment = async (req, res) => {
  try {
    const {
      user_id,
      payment_method,
      amount,
      promo_code,
      payment_type,
      sender_number,
      txnid,
      courses_id,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO enroll (user_id, payment_method, amount, promo_code, payment_type, sender_number, txnid, courses_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        payment_method,
        amount,
        promo_code,
        payment_type,
        sender_number,
        txnid,
        courses_id,
      ]
    );
    res.status(200).send({
      success: true,
      message: "Enroll inserted successfully",
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

exports.ceckPayment = async (req, res) => {
  try {
    const { userid, coursesid } = req.query;

    const [result] = await db.query(
      `SELECT * FROM enroll WHERE courses_id=? AND user_id=?`,
      [coursesid, userid]
    );

    if (result.length > 0) {
      return res.status(201).send({
        success: true,
        message: "You have already Enrolled",
        data: result[0],
      });
    }
    res.status(200).send({
      success: true,
      message: "You can Enroll",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Database error",
      error: error.message,
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT 
        enroll.*, 
        users.name, 
        users.email, 
        users.studentID, 
        users.profilePic,
        users.status AS user_status,
        courses.course_name,
        courses.promo_code AS course_promo_code,
        courses.full_payment_discount,
        courses.promo_code_discount,
        courses.price
      FROM enroll
      JOIN users ON enroll.user_id = users.id
      JOIN courses ON enroll.courses_id = courses.id;
    `);

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No enroll found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "All enroll",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All enroll",
      error: error.message,
    });
  }
};

exports.getSinglePayment = async (req, res) => {
  try {
    const enrollId = req.params.id;
    if (!enrollId) {
      return res.status(404).send({
        success: false,
        message: "Enroll ID is required in params",
      });
    }

    const [data] = await db.query(
      `
      SELECT 
        enroll.*, 
        users.name, 
        users.email, 
        users.studentID, 
        users.profilePic,
        users.status AS user_status,
        courses.course_name,
        courses.promo_code AS course_promo_code,
        courses.full_payment_discount,
        courses.promo_code_discount,
        courses.price
      FROM enroll
      JOIN users ON enroll.user_id = users.id
      JOIN courses ON enroll.courses_id = courses.id
      WHERE enroll.id = ?;
    `,
      [enrollId]
    );

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No enroll found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Enroll details retrieved successfully",
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get Single Enroll",
      error: error.message,
    });
  }
};

exports.statusUpadate = async (req, res) => {
  try {
    const { status, userId } = req.body;
    if (!status || !userId) {
      return res.status(500).send({
        success: false,
        message: "status and userId is required in body",
      });
    }

    const [data] = await db.query(
      `UPDATE enroll SET status=? WHERE user_id=?`,
      [status, userId]
    );

    const paymentStatus = "active";
    if (status == "completed") {
      await db.query(`UPDATE users SET paymentStatus=? WHERE id=?`, [
        paymentStatus,
        userId,
      ]);
    }

    res.status(200).send({
      success: true,
      message: "Enroll status updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in enroll status update",
      error: error.message,
    });
  }
};
