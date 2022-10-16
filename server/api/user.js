const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let router = express.Router();
const connection = require("../database");

//Route is base/user/

const users = [];

router.route("/users").get(async (req, res) => {
  let sql = "SELECT * FROM login.users;";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//Below are various controller links
router.route("/register").post(async (req, res) => {
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

router.route("/login").post(async (req, res) => {
  //Authenticate users
  const user = users.find((user) => (user.username = req.body.username));
  if (user == null) {
    return res.status(400).send("Cannot find user!");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const user = { username: req.body.username }; //creates user obj for the token
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
      refreshTokens.push(refreshToken);
    } else {
      res.send("Login failed!");
    }
  } catch {
    res.status(500).send();
  }
});

let refreshTokens = [];
router.route("/token").post((req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken: accessToken });
  });
});

router.route("/logout").delete((req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

  res.sendStatus(204);
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

module.exports = router; //Exports our routes
