import express from 'express'
import { authorController } from '~/controllers/authorController.js'

const Router = express.Router()

// ADD AUTHOR
Router.post('/', authorController.addAuthor)

// GET AUTHOR
Router.get('/', authorController.getAllAuthors)

// GET AN AUTHOR IN DETAIL
Router.get('/:id', authorController.getAnAuthor)

// UPDATE AN AUTHOR
Router.put('/:id', authorController.updateAnAuthor)

// DELETE AN AUTHOR
Router.delete('/:id', authorController.deleteAnAuthor)

export const authorRoute = Router
