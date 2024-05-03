const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const todoMiddleware = async (req, res, next) => {
  const userId = req.body;
  const { title, status, created_at, priority } = req.body;

  try {
    if (title == undefined) {
      return res.status(400).send({ msg: "All fields are required" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }

  next();
};

module.exports = todoMiddleware;
