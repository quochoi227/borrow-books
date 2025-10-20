import express from 'express'
import { authorController } from '../../controllers/authorController.js'

const Router = express.Router()

// ADD AUTHOR
Router.route('/')
  .post(authorController.addAuthor)
  .get(authorController.getAllAuthors)

// GET AN AUTHOR IN DETAIL
Router.route('/:id')
  .get(authorController.getAnAuthor)
  .put(authorController.updateAnAuthor)
  .delete(authorController.deleteAnAuthor)

export const authorRoute = Router
