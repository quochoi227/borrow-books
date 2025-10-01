import express from 'express'
import { requestController } from '~/controllers/requestController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// ADD BOOK
Router.post('/', authMiddleware.isAuthorized, requestController.addRequest)

// GET ALL BOOKS
Router.get('/', authMiddleware.isAuthorized, requestController.getAllRequests)

// UPDATE A BOOK
Router.put('/:id', authMiddleware.isAuthorized, requestController.updateRequest)

export const requestRoute = Router
