const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const registerMiddleware = require("../middlewares/registerMiddleware");

const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.post("/register", registerMiddleware, async (req, res) => {
  const { pass } = req.body;

  try {
    const newPass = await bcrypt.hash(pass, 10);

    const user = await prisma.user.create({
      data: { ...req.body, age: +req.body.age, pass: newPass },
    });

    res.send({ msg: "User registered successfully", user });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const comparepass = await bcrypt.compare(pass, user.pass);
    if (!comparepass) {
      return res.status(400).send("Invalid credentials");
    } else {
      const token = jwt.sign(
        { userId: user.id, name: user.name },
        process.env.secretKey,
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .send({ msg: "User logged in successfully", token, name: user.name });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

userRouter.get("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.send({ msg: "Login First" });
  }
  try {
    res.status(200).send({ msg: "User Logged out successfully" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = userRouter;
