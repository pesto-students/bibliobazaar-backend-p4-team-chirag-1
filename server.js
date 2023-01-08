import express from 'express'
import mongoose from 'mongoose'
import unless from "express-unless"
import upload from 'express-fileupload'
import cors from "cors";
import * as dotenv from 'dotenv'
dotenv.config()

import { userRouter } from './routes/userRoute'
import { authenticateToken } from './middlewares/auth.js'
import { errorHandler } from './middlewares/errors'
import { uploadRouter } from './routes/uploadRoute'
import { paymentRouter } from './routes/paymentRoute'

const app = express()
app.use(cors());

mongoose.Promise = global.Promise;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT)
    app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))
  } catch (err) {
    console.error(err)
  }
}

start()

authenticateToken.unless = unless;
app.use(
  authenticateToken.unless({
    path: [
      { url: "/", methods: ["GET"] },
      { url: "/user/signUp", methods: ["POST"] },
      { url: "/user/login", methods: ["POST"] },
      // Added Temporarily to check payments
      { url: "/payment/checkout", methods: ["POST"] },
      { url: "/payment/verify", methods: ["POST"] },
    ],
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(upload())

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World, Server is working',
  })
})

// User Routes
app.use('/user', userRouter)
app.use('/',uploadRouter)

// Payment Routes
app.use('/payment', paymentRouter)

// middleware for error responses
app.use(errorHandler);


