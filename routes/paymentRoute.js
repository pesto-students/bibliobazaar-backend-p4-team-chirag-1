import express from 'express'
import { checkout, paymentVerification } from '../controllers/payment.controller'

const paymentRouter = express.Router()

paymentRouter.post('/checkout', checkout)
paymentRouter.post('/verify', paymentVerification)

export { paymentRouter }
