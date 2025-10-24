import express from 'express'
import publisherController from '../../controllers/publisherController.js'

const Router = express.Router()

Router.route('/')
  .get(publisherController.getAllPublishers)
  .post(publisherController.addPublisher)

export const publisherRoute = Router
