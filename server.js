import express from 'express'
import mongoose from 'mongoose'

import { mongoConnect, PORT } from './config/config'
import { userRouter } from './routes/userRoute'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World, Server is working',
  })
})

// User Routes
app.use('/user', userRouter)

const start = async () => {
  try {
    await mongoose.connect(mongoConnect)
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  } catch (err) {
    console.error(err)
  }
}

start()
