import express from 'express'

import users from '../models/userModel';

const userRouter = express.Router()

userRouter
  // Get all users
  .get('/', async (req, res) => {
    return res.status(400).json({ message: 'No Users Found'})
  })

export { userRouter }