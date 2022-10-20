const jwt = require("jsonwebtoken");
//Other imports above

const authenticateToken = (req, res, next) => {
  const token = req.cookies.access;
  if (token == null) {
    const refreshToken = req.cookies.refresh;
    if (refreshToken == null) {
      return res.sendStatus(401);
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) return res.sendStatus(403).send("Invalid refresh token!");
          const newToken = jwt.sign(
            {
              username: user.username,
              email: user.email,
              age: user.age,
              id: user.id,
            },
            process.env.ACCESS_TOKEN_SECRET
          );

          const newCookie = await res.cookie("access", newToken, {
            maxAge: 300000,
            secure: true,
            httpOnly: true,
            sameSite: "None",
          });
        }
      );
      jwt.verify(
        req.cookies.access,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.send(err);
          console.log(user);
          return next();
        }
      );
    }
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.send(err);
    console.log(user);
    next();
  });
};

module.exports = { authenticateToken };
