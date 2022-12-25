import express from 'express'

import { signUp, login, updateProfilePicture } from "../controllers/user.controller"

const userRouter = express.Router()

userRouter.post('/signUp', signUp)
userRouter.post('/login', login)
userRouter.post('/updateProfilePicture', updateProfilePicture)

export { userRouter }
