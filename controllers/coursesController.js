const db = require("../config/db");

exports.getAllCourses = async (req, res) => {
  try {
    const [data] = await db.query(`SELECT * FROM Courses;`);

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Courses found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "All Courses",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Courses",
      error: error.message,
    });
  }
};

exports.getSingleCourse = async (req, res) => {
  try {
    const coursesId = req.params.id;
    const [data] = await db.query(`SELECT * FROM Courses WHERE id=?`, [
      coursesId,
    ]);

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Courses found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Get Courses",
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get Courses",
      error: error.message,
    });
  }
};
