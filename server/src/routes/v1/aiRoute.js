import express from 'express'
import aiController from '../../controllers/aiController.js'

const Router = express.Router()

Router.post('/generate-text', aiController.generateText)

export const aiRoute = Router
