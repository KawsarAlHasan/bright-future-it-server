const db = require("../config/db");

// get all Project
exports.getAllProjects = async (req, res) => {
  try {
    const coursesID = req.params.id;
    if (!coursesID) {
      return res.status(400).send({
        success: false,
        message: "coursesID is required in Params",
      });
    }
    // Query to get all milestones
    const [data] = await db.query(
      `SELECT * FROM live_projects WHERE courses_id =?`,
      [coursesID]
    );

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Project found",
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Get all projects",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Projects",
      error: error.message,
    });
  }
};

// get single project by id
exports.getSingleProject = async (req, res) => {
  try {
    const projectID = req.params.id;
    if (!projectID) {
      return res.status(400).send({
        success: false,
        message: "projectID is required in Params",
      });
    }
    // Query to get all milestones
    const [data] = await db.query(`SELECT * FROM live_projects WHERE id =?`, [
      projectID,
    ]);

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Project found",
        data: data[0],
      });
    }

    res.status(200).send({
      success: true,
      message: "Get single projects",
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get Single Projects",
      error: error.message,
    });
  }
};

// create Project
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      complete_date,
      ui_ux_design,
      source_code,
      description,
      courses_id,
    } = req.body;
    if (
      !title ||
      !complete_date ||
      !ui_ux_design ||
      !source_code ||
      !description ||
      !courses_id
    ) {
      return res.status(500).send({
        success: false,
        message:
          "title, complete_date, ui_ux_design, source_code, description, courses_id is required in body",
      });
    }

    const [result] = await db.query(
      `INSERT INTO live_projects (title, complete_date, ui_ux_design, source_code, description, courses_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, complete_date, ui_ux_design, source_code, description, courses_id]
    );
    res.status(200).send({
      success: true,
      message: "Project inserted successfully",
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

// update Project
exports.updateProject = async (req, res) => {
  try {
    const projectID = req.params.id;
    if (!projectID) {
      return res.status(500).send({
        success: false,
        message: "projectID is required in params",
      });
    }

    const { title, complete_date, ui_ux_design, source_code, description } =
      req.body;
    if (
      !title ||
      !complete_date ||
      !ui_ux_design ||
      !source_code ||
      !description
    ) {
      return res.status(500).send({
        success: false,
        message:
          "title, complete_date, ui_ux_design, source_code, description is required in body",
      });
    }

    const [data] = await db.query(
      `UPDATE live_projects SET title =?, complete_date =?, ui_ux_design =?, source_code =?, description =? WHERE id=?`,
      [title, complete_date, ui_ux_design, source_code, description, projectID]
    );

    res.status(200).send({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Project update",
      error: error.message,
    });
  }
};

// delete Project
exports.deleteProject = async (req, res) => {
  try {
    const projectID = req.params.id;
    if (!projectID) {
      return res.status(404).send({
        success: false,
        message: "projectID is required in params",
      });
    }

    const [data] = await db.query(`SELECT * FROM live_projects WHERE id =?`, [
      projectID,
    ]);

    if (!data || data.length === 0) {
      return res.status(400).send({
        success: false,
        message: "No Project found",
        data: [],
      });
    }

    await db.query(`DELETE FROM live_projects WHERE id=?`, [projectID]);

    res.status(200).send({
      success: true,
      message: "Project Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete Project",
      error: error.message,
    });
  }
};
