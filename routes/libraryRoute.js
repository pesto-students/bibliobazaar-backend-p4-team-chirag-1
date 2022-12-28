import express from 'express'

import { search, addBook, editBook, removeBook, bookDetails, getCollection } from "../controllers/library.controller"

const libraryRouter = express.Router()

libraryRouter.post('/search', search)
libraryRouter.post('/add', addBook)
libraryRouter.post('/edit', editBook)
libraryRouter.post('/remove', removeBook)
libraryRouter.post('/details', bookDetails)
libraryRouter.post('/collection', getCollection)

export { libraryRouter }
