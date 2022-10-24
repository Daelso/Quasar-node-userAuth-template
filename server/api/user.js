const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Users = require("../models/Users");
const { sequelize } = require("../database");
const lib = require("../lib");
const mailer = require("../mailer");

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
        id: user.user_id,
        username: user.username,
        email: user.email,
        age: user.age,
      };
      const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5m",
      });

      const refreshToken = jwt.sign(
        userInfo,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "90d",
        }
      );
      const accessCookie = await res.cookie("access", accessToken, {
        maxAge: 300000,
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });
      const refreshCookie = await res.cookie("refresh", refreshToken, {
        maxAge: 7.884e9,
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });
      res.status(200).send("Logged in!");
    } else {
      res.status(401).send("Incorrect email or password!");
    }
  } catch {
    res.status(500).send();
  }
});

router.route("/token").post(async (req, res) => {
  res.clearCookie("access");
  const refreshToken = req.cookies.refresh;

  if (refreshToken == null) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) return res.sendStatus(403).send("Invalid refresh token!");
      let newToken = jwt.sign(
        {
          username: user.username,
          email: user.email,
          age: user.age,
          id: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      const newCookie = await res.cookie("access", newToken, {
        maxAge: 300000,
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });
      res.status(200).send(`Token refreshed`);
    }
  );
});

router.route("/logout").delete((req, res) => {
  res.clearCookie("access");
  res.clearCookie("refresh");
  res.sendStatus(204);
});

router.route("/passwordForgot").post(async (req, res) => {
  const resetUser = await Users.findOne({ where: { email: req.body.email } });
  if (resetUser === null) {
    return res.sendStatus(404);
  }
  const secret = process.env.RESET_TOKEN_SECRET + resetUser.get("password"); //generates a new secret unique to a user.
  const payload = { username: resetUser.get("user_id") };
  const token = jwt.sign(payload, secret, { expiresIn: "30m" }); //users get 30 mins to reset their account

  let resetLink = null;
  if (process.env.ENV === "DEV") {
    resetLink = `http://localhost:8080/passwordReset/${resetUser.get(
      "user_id"
    )}?token=${token}`;
  } else {
    resetLink = `https://wod-char-maker.herokuapp.com/passwordReset/${resetUser.get(
      "user_id"
    )}?token=${token}`;
  }

  mailer.sendResetEmail(req.body.email, resetUser.get("username"), resetLink);
  res.sendStatus(200);
});

router.route("/passwordReset/:user/:token").post(async (req, res) => {
  res.clearCookie("access");
  res.clearCookie("refresh");

  console.log(req.body.password);
  console.log(req.params);
  const resetUser = await Users.findByPk(req.params.user);
  if (resetUser === null) {
    return sendStatus(404);
  }

  const secret = process.env.RESET_TOKEN_SECRET + resetUser.get("password");
  try {
    const payload = jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await resetUser.update({ password: hashedPassword });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
  res.sendStatus(200);
});

module.exports = router; //Exports our routes
