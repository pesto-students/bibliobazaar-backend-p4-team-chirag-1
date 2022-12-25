import express from 'express'
import mongoose from 'mongoose'
import unless from "express-unless"

import { mongoConnect, PORT } from './config/config'
import { userRouter } from './routes/userRoute'
import { authenticateToken } from './middlewares/auth.js'
import { errorHandler } from './middlewares/errors'

const app = express()

mongoose.Promise = global.Promise;
const start = async () => {
  try {
    await mongoose.connect(mongoConnect)
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  } catch (err) {
    console.error(err)
  }
}

start()

authenticateToken.unless = unless;
app.use(
  authenticateToken.unless({
    path: [
      // { url: "/", methods: ["GET"] },
      { url: "/user/signUp", methods: ["POST"] },
      { url: "/user/login", methods: ["POST"] },
    ],
  })
);

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World, Server is working',
  })
})

// User Routes
app.use('/user', userRouter)

// middleware for error responses
app.use(errorHandler);


