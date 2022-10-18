const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let router = express.Router();
const db = require("../database");
const Users = require("../models/Users");
const { sequelize } = require("../database");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Route is base/user/

router.route("/users").get(async (req, res) => {
  Users.findAll()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => console.log(err));
});

//Below are various controller links
router.route("/register").post(async (req, res) => {
  try {
    //Encrypts the password.
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await Users.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age,
      terms_accepted: req.body.acceptance,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.status(200).send("User created successfully!");
  } catch (err) {
    res.status(403).send(err);
  }
});

router.route("/login").post(async (req, res) => {
  //Authenticate users
  const user = await Users.findOne({ where: { email: req.body.email } });

  if (user == null) {
    return res.status(400).send("Cannot find user!");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const userInfo = {
        username: user.username,
        email: user.email,
        age: user.age,
      };
      const accessToken = generateAccessToken(userInfo);

      const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET);
      const cookie = await res.cookie("token", accessToken, {
        maxAge: 300000,
        secure: true,
        httpOnly: true,
      });
      res.status(200).send("Logged in!");
    } else {
      res.send("Incorrect email or password!");
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
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

module.exports = router; //Exports our routes
