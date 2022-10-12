const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
const users = [];

//for dev use only, very insecure in a prod env, this is just to prevent CORS errors. Origin is your vue clients port
if (process.env.ENV !== "prod") {
  var corsOptions = {
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));
}

//Below are various controller links

app.get("/users", async (req, res) => {
  res.send(users);
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age,
      termsAccepted: req.body.acceptance,
    });
    res.status(200).send("uploaded user");
  } catch {
    res.status(500).send();
  }
  console.log(users);
});

app.listen(port, () => console.log(`Server started on port ${port}`));
