const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).send({ message: "Access token not found" });
  }

  jwt.verify(token, process.env.secretKey, async (err, decoded) => {
    if (err) {
      res.status(400).send({ message: "Invalid token" });
    } else {
      req.body.userId = decoded.userId;
      req.body.name = decoded.name;
      console.log(decoded.userId);
      next();
    }
  });
};

module.exports = auth;
