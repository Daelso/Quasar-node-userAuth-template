const express = require("express");
const jwt = require("jsonwebtoken");
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
    //Encrypts the password.
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
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

app.post("/login", async (req, res) => {
  //Authenticate users
  const user = users.find((user) => (user.username = req.body.username));
  if (user == null) {
    return res.status(400).send("Cannot find user!");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const user = { username: req.body.username }; //creates user obj for the token
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); //Must be created in your env
      res.json({ accessToken: accessToken });
    } else {
      res.send("Login failed!");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
