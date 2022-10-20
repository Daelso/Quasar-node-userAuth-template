const express = require("express"),
  serveStatic = require("serve-static"),
  history = require("connect-history-api-fallback"),
  port = process.env.PORT || 5000;
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(history());
app.use(serveStatic(__dirname + "/dist/spa"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const lib = require("./server/lib"); //This is all custom functions
const sql = require("./server/database");

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

const userRoutes = require("./server/api/user");
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
});
