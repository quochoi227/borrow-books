import express from 'express'
import { bookController } from '../../controllers/bookController.js'
import { multerUploadMiddleware } from '../../middlewares/multerUploadMiddleware.js'

const Router = express.Router()

// ADD BOOK
Router.post('/', multerUploadMiddleware.upload.fields([
  { name: 'bookImg', maxCount: 1 },
  { name: 'bookImgs', maxCount: 10 }
]), bookController.addBook)

// GET ALL BOOKS
Router.get('/', bookController.getAllBooks)

// GET A BOOK IN DETAIL
Router.get('/:id', bookController.getABook)

// UPDATE A BOOK
Router.put('/:id', multerUploadMiddleware.upload.fields([
  { name: 'bookImg', maxCount: 1 },
  { name: 'bookImgs', maxCount: 10 }
]), bookController.updateABook)

// DELETE A BOOK
Router.delete('/:id', bookController.deleteABook)

Router.post('/upload_image', multerUploadMiddleware.upload.single('bookImg'), bookController.uploadImage)
Router.post('/upload_images', multerUploadMiddleware.upload.array('bookImgs'), bookController.uploadImages)

export const bookRoute = Router
