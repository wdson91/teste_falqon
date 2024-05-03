const express = require("express");

const todosRoute = require("./routes/todosRoutes");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://teste-falqon-front.vercel.app",
  })
);

app.use("/users", userRouter);
app.use("/todo", todosRoute);

const { PrismaClient } = require("@prisma/client");
app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});

app.listen(process.env.port, async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  console.log(`Server is running at port ${process.env.port}`);
});
