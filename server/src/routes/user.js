import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const router = express.Router()
import { UserModel } from "../models/Users.js"

// 1. user regiter 
router.post("/register", async (req, res) => {
  const { username, password } = req.body
  const user = await UserModel.findOne({ username })
  if (user) {
    return res.status(400).json({ message: "Username already exists" })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new UserModel({ username, password: hashedPassword })
  await newUser.save()
  res.json({ message: "User registered successfully" })
})

// 2.user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body

  const user = await UserModel.findOne({ username })

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" })
  }
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" })
  }
  const token = jwt.sign({ id: user._id }, "secret")
  res.json({ token, userID: user._id })
})

export { router as userRouter }

// user validation
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    jwt.verify(authHeader, "secret", (err) => {
      if (err) {
        return res.sendStatus(403)
      }
      next()
    })
  } else {
    res.sendStatus(401)
  }
};

