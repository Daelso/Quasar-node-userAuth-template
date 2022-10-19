const jwt = require("jsonwebtoken");
//Other imports above

const authenticateToken = async (req, res, next) => {
  const token = await req.cookies.access;
  console.log(token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.send(err);
    console.log(user);
    next();
  });
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

module.exports = { authenticateToken, generateAccessToken };
