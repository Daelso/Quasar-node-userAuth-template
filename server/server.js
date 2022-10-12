const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
var cors = require("cors");
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
const users = [];

//for dev use only, very insecure in a prod env
if (process.env.ENV !== "prod") {
  app.use(cors({ origin: true }));
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
