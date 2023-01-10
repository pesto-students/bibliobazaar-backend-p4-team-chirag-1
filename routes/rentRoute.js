import express from 'express'
import { getRentDetails, getIssuedHistory, getOfferedHistory, addHistory } from "../controllers/rent.controller"

const RentRouter = express.Router()

RentRouter.get('/details', getRentDetails)
RentRouter.get('/rent', getIssuedHistory)
RentRouter.get('/offered', getOfferedHistory)
RentRouter.get('/add', addHistory)

export { RentRouter }