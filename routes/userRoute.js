import express from 'express'

import { signUp } from "../controllers/user.controller"

const userRouter = express.Router()

userRouter
  // Get all users
  .post('/signUp', signUp)

export { userRouter }
