import express from 'express'
import { bookRoute } from './bookRoute.js'
import { authorRoute } from './authorRoute.js'
import { userRoute } from './userRoute.js'
import { publisherRoute } from './publisherRoute.js'
import { requestRoute } from './requestRoute.js'

const Router = express.Router()

Router.use('/books', bookRoute)
Router.use('/authors', authorRoute)
Router.use('/users', userRoute)
Router.use('/sources', publisherRoute)
Router.use('/requests', requestRoute)

export const APIs_V1 = Router
