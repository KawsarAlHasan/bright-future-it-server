const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const mySqlPool = require("./config/db");
const path = require("path");
const app = express();
dotenv.config();

const globalCorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(globalCorsOptions));
app.options("*", cors(globalCorsOptions));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/v1/admin", require("./routes/adminRoute"));
app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/milestone", require("./routes/milestoneRoute"));
app.use("/api/v1/courses", require("./routes/coursesRoute"));
app.use("/api/v1/enroll", require("./routes/enrollRoute"));
app.use("/api/v1/project", require("./routes/liveProjectRoute"));

const port = process.env.PORT || 8080;

mySqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("MYSQL DB Connected");

    // listen
    app.listen(port, () => {
      console.log(`BFIT Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.status(200).send("BFIT server is working");
});

// 404 Not Found middleware
app.use("*", (req, res, next) => {
  res.status(404).json({
    error: "You have hit the wrong route",
  });
});
