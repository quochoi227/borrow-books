import express from 'express'
import { requestController } from '../../controllers/requestController.js'

const Router = express.Router()

// ADD REQUEST
Router.post('/', requestController.addRequest)

// GET ALL REQUESTS
Router.get('/', requestController.getAllRequests)

// GET REQUESTS BY USERID
Router.get('/:id', requestController.getRequestsById)

// UPDATE A REQUEST
Router.put('/:id', requestController.updateRequest)

// DELETE A REQUEST
Router.delete('/:id', requestController.deleteRequest)

export const requestRoute = Router
