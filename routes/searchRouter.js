import { searchBook } from "../controllers/search.controller"
import express from 'express'

const searchRouter = express.Router()

searchRouter.get('/', searchBook)

export { searchRouter }
