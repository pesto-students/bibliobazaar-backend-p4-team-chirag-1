import express from 'express'

import {
  signUp,
  login,
  updateProfilePicture,
  getUserAccount,
  updateUserAccount,
  addAddress,
  editAddress,
  deleteAddress,
  addressesList,
  addToCart,
  deleteFromCart,
  deleteAllFromCart,
} from "../controllers/user.controller"

const userRouter = express.Router()

userRouter.post('/signUp', signUp)
userRouter.post('/login', login)

userRouter.post('/updateProfilePicture', updateProfilePicture)
userRouter.get('/account', getUserAccount)
userRouter.post('/updateAccount', updateUserAccount)

userRouter.post('/addAddress', addAddress)
userRouter.post('/editAddress', editAddress)
userRouter.post('/deleteAddress', deleteAddress)
userRouter.get('/addressesList', addressesList)

userRouter.post('/addToCart', addToCart)
userRouter.post('/deleteFromCart', deleteFromCart)
userRouter.post('/deleteAllFromCart', deleteAllFromCart)

export { userRouter }
