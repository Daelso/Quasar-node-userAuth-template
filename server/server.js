const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const port = process.env.PORT || 8080;
const lib = require("./lib"); //This is all custom functions
const sql = require("./database");

//for dev use only, very insecure in a prod env, this is just to prevent CORS errors. Origin is your vue clients port
if (process.env.ENV !== "prod") {
  let corsOptions = {
    origin: ["http://localhost:8080"],
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

//Above is library imports, below begin route imports

const userRoutes = require("./api/user");
app.use("/user", userRoutes);
//Uses userRoutes file to handle all user related endpoints

const posts = [
  {
    username: "Glennyballs",
    post: "I hate this!",
  },
  {
    username: "Carl22",
    post: "I love this!",
  },
];

//Below are various controller links

app.get("/posts", lib.authenticateToken, (req, res) => {
  res.json(posts);
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
  sql.mysql.connect((err) => {
    if (err) throw err;
    console.log("mySQL connected");
  });
});
