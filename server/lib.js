const jwt = require("jsonwebtoken");
//Other imports above

const authenticateToken = (req, res, next) => {
  const token = req.cookies.access;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.send(err);
    console.log(user);
    next();
  });
};

module.exports = { authenticateToken };
