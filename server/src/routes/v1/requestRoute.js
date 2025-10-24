import express from 'express'
import requestController from '../../controllers/requestController.js'

const Router = express.Router()

Router.route('/')
  .post(requestController.addRequest)
  .get(requestController.getAllRequests)

Router.route('/:id')
  .get(requestController.getRequestsById)
  .put(requestController.updateRequest)
  .delete(requestController.deleteRequest)

export const requestRoute = Router
