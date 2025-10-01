import express from 'express'
import { bookController } from '~/controllers/bookController.js'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'

const Router = express.Router()

// ADD BOOK
Router.post('/', bookController.addBook)

// GET ALL BOOKS
Router.get('/', bookController.getAllBooks)

// GET A BOOK IN DETAIL
Router.get('/:id', bookController.getABook)

// UPDATE A BOOK
Router.put('/:id', bookController.updateABook)

// DELETE A BOOK
Router.delete('/:id', bookController.deleteABook)

Router.post('/upload_image', multerUploadMiddleware.upload.single('bookImg'), bookController.uploadImage)

export const bookRoute = Router
