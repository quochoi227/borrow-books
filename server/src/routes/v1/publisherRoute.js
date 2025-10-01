import express from 'express'
import { publisherController } from '~/controllers/publisherController'

const Router = express.Router()

Router.route('/')
  .get(publisherController.getAllSources)
  .post(publisherController.addSource)

export const publisherRoute = Router
