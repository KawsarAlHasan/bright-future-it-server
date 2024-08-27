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
    const { user_id, courses_id } = req.body;

    const [result] = await db.query(`SELECT * FROM enroll `);
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
