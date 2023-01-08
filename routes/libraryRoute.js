import express from 'express'

import { search, findBook, addBook, editBook, removeBook, bookDetails, getCollection } from "../controllers/library.controller"

const libraryRouter = express.Router()

libraryRouter.post('/search', search)
libraryRouter.get('/find', findBook)
libraryRouter.post('/add', addBook)
libraryRouter.post('/edit', editBook)
libraryRouter.post('/remove', removeBook)
libraryRouter.get('/details', bookDetails)
libraryRouter.get('/collection', getCollection)

export { libraryRouter }
