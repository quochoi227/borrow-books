import express from 'express'
import bookController from '../../controllers/bookController.js'
import multerUploadMiddleware from '../../middlewares/multerUploadMiddleware.js'
import { authMiddleware } from '../../middlewares/userAuthMiddleware.js'

const Router = express.Router()

Router.route('/')
  .post(multerUploadMiddleware.upload.fields([
    { name: 'bookImg', maxCount: 1 },
    { name: 'bookImgs', maxCount: 10 }
  ]), bookController.addBook)
  .get(bookController.getAllBooks)


Router.route('/:id')
  .get(bookController.getABook)
  .put(multerUploadMiddleware.upload.fields([
    { name: 'bookImg', maxCount: 1 },
    { name: 'bookImgs', maxCount: 10 }
  ]), bookController.updateABook)
  .delete(bookController.deleteABook)

Router.post('/upload_image', multerUploadMiddleware.upload.single('bookImg'), bookController.uploadImage)
Router.post('/upload_images', multerUploadMiddleware.upload.array('bookImgs'), bookController.uploadImages)

export const bookRoute = Router
