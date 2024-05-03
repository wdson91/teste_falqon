const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const todoMiddleware = async (req, res, next) => {
  const userId = req.body.userId;
  const { title, status, created_at, priority } = req.body;

  if (title == undefined || status == undefined || !created_at || !priority) {
    return res.status(400).send({ msg: "All fields are required" });
  }

  const existedTodo = await prisma.todo.findUnique({ where: { title } });

  if (existedTodo) {
    return res.status(400).send({ msg: "Todo is already created" });
  }

  next();
};

module.exports = todoMiddleware;
