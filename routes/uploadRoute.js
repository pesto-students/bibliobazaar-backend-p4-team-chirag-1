import express from 'express'

import { upload } from "../controllers/upload.controller"

const uploadRouter = express.Router()

uploadRouter.post('/upload', upload)

export { uploadRouter }
